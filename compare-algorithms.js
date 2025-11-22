import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Utility functions
 */
function loadParticipants() {
  const filePath = path.join(__dirname, 'participants.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function buildConstraintMap(participants) {
  const constraints = new Map();
  for (const participant of participants) {
    constraints.set(participant.name, new Set(participant.notAllowedNames));
  }
  return constraints;
}

function isValidAssignment(giver, receiver, constraints) {
  if (giver === receiver) return false;
  const notAllowed = constraints.get(giver);
  return !(notAllowed && notAllowed.has(receiver));
}

/**
 * ALGORITHM 1: Current Approach - Greedy Random with Retries
 * Time Complexity: O(n²) per attempt, but may need many attempts
 * Space Complexity: O(n)
 */
function greedyRandom(participants, constraints) {
  const assignments = new Map();
  const assignedReceivers = new Set();
  
  for (const giver of participants) {
    const availableReceivers = participants
      .map(p => p.name)
      .filter(receiver => 
        !assignedReceivers.has(receiver) && 
        isValidAssignment(giver.name, receiver, constraints)
      );
    
    if (availableReceivers.length === 0) {
      return null;
    }
    
    const selectedReceiver = availableReceivers[Math.floor(Math.random() * availableReceivers.length)];
    assignments.set(giver.name, selectedReceiver);
    assignedReceivers.add(selectedReceiver);
  }
  
  return assignments;
}

/**
 * ALGORITHM 2: Backtracking - Systematic Search
 * Time Complexity: O(n!) worst case, but typically much better with pruning
 * Space Complexity: O(n) for recursion stack
 * Guaranteed to find a solution if one exists
 */
function backtracking(participants, constraints) {
  const names = participants.map(p => p.name);
  const assignments = new Map();
  const assignedReceivers = new Set();
  
  function solve(index) {
    if (index === names.length) {
      return true; // All assigned
    }
    
    const giver = names[index];
    const availableReceivers = names.filter(receiver => 
      !assignedReceivers.has(receiver) && 
      isValidAssignment(giver, receiver, constraints)
    );
    
    // Shuffle for randomness
    for (let i = availableReceivers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableReceivers[i], availableReceivers[j]] = [availableReceivers[j], availableReceivers[i]];
    }
    
    for (const receiver of availableReceivers) {
      assignments.set(giver, receiver);
      assignedReceivers.add(receiver);
      
      if (solve(index + 1)) {
        return true;
      }
      
      // Backtrack
      assignments.delete(giver);
      assignedReceivers.delete(receiver);
    }
    
    return false;
  }
  
  return solve(0) ? assignments : null;
}

/**
 * ALGORITHM 3: Shuffle and Verify
 * Time Complexity: O(n²) per shuffle, but may need many shuffles
 * Space Complexity: O(n)
 * Simple but potentially inefficient for tight constraints
 */
function shuffleAndVerify(participants, constraints) {
  const names = participants.map(p => p.name);
  const shuffled = [...names].sort(() => Math.random() - 0.5);
  
  // Check if this permutation is valid
  for (let i = 0; i < names.length; i++) {
    if (!isValidAssignment(names[i], shuffled[i], constraints)) {
      return null;
    }
  }
  
  const assignments = new Map();
  for (let i = 0; i < names.length; i++) {
    assignments.set(names[i], shuffled[i]);
  }
  
  return assignments;
}

/**
 * ALGORITHM 4: Constraint Satisfaction with MRV (Minimum Remaining Values)
 * Time Complexity: O(n²) typically, better than greedy for tight constraints
 * Space Complexity: O(n)
 * Chooses the giver with fewest valid options first (most constrained first)
 */
function mrvHeuristic(participants, constraints) {
  const assignments = new Map();
  const assignedReceivers = new Set();
  const remaining = participants.map(p => ({
    participant: p,
    validReceivers: participants
      .map(r => r.name)
      .filter(receiver => isValidAssignment(p.name, receiver, constraints))
  }));
  
  while (remaining.length > 0) {
    // Sort by number of valid receivers (MRV heuristic)
    remaining.sort((a, b) => {
      const aCount = a.validReceivers.filter(r => !assignedReceivers.has(r)).length;
      const bCount = b.validReceivers.filter(r => !assignedReceivers.has(r)).length;
      return aCount - bCount;
    });
    
    const current = remaining[0];
    const availableReceivers = current.validReceivers.filter(
      r => !assignedReceivers.has(r)
    );
    
    if (availableReceivers.length === 0) {
      return null;
    }
    
    const selectedReceiver = availableReceivers[Math.floor(Math.random() * availableReceivers.length)];
    assignments.set(current.participant.name, selectedReceiver);
    assignedReceivers.add(selectedReceiver);
    remaining.shift();
  }
  
  return assignments;
}

/**
 * ALGORITHM 5: Graph-based Bipartite Matching (using DFS)
 * Time Complexity: O(n²) in practice
 * Space Complexity: O(n²) for adjacency list
 * Models the problem as finding a perfect matching in a bipartite graph
 */
function graphBasedMatching(participants, constraints) {
  const names = participants.map(p => p.name);
  const n = names.length;
  
  // Build adjacency list: giver -> [valid receivers]
  const graph = new Map();
  for (const giver of names) {
    graph.set(giver, names.filter(receiver => 
      isValidAssignment(giver, receiver, constraints)
    ));
  }
  
  const assignments = new Map(); // giver -> receiver
  const receiverToGiver = new Map(); // receiver -> giver
  
  // Try to find a perfect matching using DFS
  function findMatching(giverIndex) {
    if (giverIndex === n) {
      return true;
    }
    
    const giver = names[giverIndex];
    const validReceivers = graph.get(giver);
    
    // Shuffle for randomness
    const shuffled = [...validReceivers].sort(() => Math.random() - 0.5);
    
    for (const receiver of shuffled) {
      if (!receiverToGiver.has(receiver)) {
        assignments.set(giver, receiver);
        receiverToGiver.set(receiver, giver);
        
        if (findMatching(giverIndex + 1)) {
          return true;
        }
        
        assignments.delete(giver);
        receiverToGiver.delete(receiver);
      }
    }
    
    return false;
  }
  
  return findMatching(0) ? assignments : null;
}

/**
 * Benchmark function
 */
function benchmark(algorithm, name, participants, constraints, maxAttempts = 1000) {
  const startTime = process.hrtime.bigint();
  let attempts = 0;
  let result = null;
  
  while (attempts < maxAttempts && result === null) {
    attempts++;
    result = algorithm(participants, constraints);
  }
  
  const endTime = process.hrtime.bigint();
  const durationMs = Number(endTime - startTime) / 1_000_000;
  
  return {
    name,
    success: result !== null,
    attempts,
    durationMs,
    result
  };
}

/**
 * Main comparison function
 */
function compareAlgorithms() {
  const participants = loadParticipants();
  const constraints = buildConstraintMap(participants);
  
  console.log('🔬 Comparing Secret Santa Algorithms\n');
  console.log(`Participants: ${participants.length}`);
  console.log('='.repeat(70));
  
  const algorithms = [
    { fn: greedyRandom, name: '1. Greedy Random (Current)' },
    { fn: backtracking, name: '2. Backtracking' },
    { fn: shuffleAndVerify, name: '3. Shuffle & Verify' },
    { fn: mrvHeuristic, name: '4. MRV Heuristic' },
    { fn: graphBasedMatching, name: '5. Graph-based Matching' }
  ];
  
  const results = [];
  
  for (const algo of algorithms) {
    const result = benchmark(algo.fn, algo.name, participants, constraints);
    results.push(result);
    
    const status = result.success ? '✅' : '❌';
    const attempts = result.success ? result.attempts : 'FAILED';
    console.log(`${status} ${result.name}`);
    console.log(`   Attempts: ${attempts}`);
    console.log(`   Time: ${result.durationMs.toFixed(2)}ms`);
    console.log('');
  }
  
  // Find fastest successful algorithm
  const successful = results.filter(r => r.success);
  if (successful.length > 0) {
    successful.sort((a, b) => a.durationMs - b.durationMs);
    console.log('='.repeat(70));
    console.log(`🏆 Fastest: ${successful[0].name} (${successful[0].durationMs.toFixed(2)}ms)`);
    
    // Show the assignment from fastest algorithm
    if (successful[0].result) {
      console.log('\n📋 Assignment from fastest algorithm:');
      console.log('-'.repeat(70));
      for (const [giver, receiver] of successful[0].result.entries()) {
        console.log(`  ${giver} → ${receiver}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Algorithm Analysis:\n');
  console.log('1. Greedy Random: Simple, fast when constraints are loose, but may need many retries');
  console.log('2. Backtracking: Guaranteed to find solution if exists, systematic but can be slower');
  console.log('3. Shuffle & Verify: Very simple, but inefficient for tight constraints');
  console.log('4. MRV Heuristic: Smart ordering, handles tight constraints better than greedy');
  console.log('5. Graph-based: Clean mathematical model, similar to backtracking');
}

// Run comparison
compareAlgorithms();

