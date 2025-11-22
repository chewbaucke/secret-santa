import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Current greedy implementation
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
    
    if (availableReceivers.length === 0) return null;
    
    const selectedReceiver = availableReceivers[Math.floor(Math.random() * availableReceivers.length)];
    assignments.set(giver.name, selectedReceiver);
    assignedReceivers.add(selectedReceiver);
  }
  
  return assignments;
}

// Backtracking
function backtracking(participants, constraints) {
  const names = participants.map(p => p.name);
  const assignments = new Map();
  const assignedReceivers = new Set();
  
  function solve(index) {
    if (index === names.length) return true;
    
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
      if (solve(index + 1)) return true;
      assignments.delete(giver);
      assignedReceivers.delete(receiver);
    }
    return false;
  }
  
  return solve(0) ? assignments : null;
}

// Shuffle & Verify
function shuffleAndVerify(participants, constraints) {
  const names = participants.map(p => p.name);
  const shuffled = [...names].sort(() => Math.random() - 0.5);
  
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

// MRV Heuristic
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
    remaining.sort((a, b) => {
      const aCount = a.validReceivers.filter(r => !assignedReceivers.has(r)).length;
      const bCount = b.validReceivers.filter(r => !assignedReceivers.has(r)).length;
      return aCount - bCount;
    });
    
    const current = remaining[0];
    const availableReceivers = current.validReceivers.filter(r => !assignedReceivers.has(r));
    if (availableReceivers.length === 0) return null;
    
    const selectedReceiver = availableReceivers[Math.floor(Math.random() * availableReceivers.length)];
    assignments.set(current.participant.name, selectedReceiver);
    assignedReceivers.add(selectedReceiver);
    remaining.shift();
  }
  
  return assignments;
}

// Graph-based
function graphBasedMatching(participants, constraints) {
  const names = participants.map(p => p.name);
  const n = names.length;
  const graph = new Map();
  for (const giver of names) {
    graph.set(giver, names.filter(receiver => isValidAssignment(giver, receiver, constraints)));
  }
  
  const assignments = new Map();
  const receiverToGiver = new Map();
  
  function findMatching(giverIndex) {
    if (giverIndex === n) return true;
    
    const giver = names[giverIndex];
    const validReceivers = graph.get(giver);
    const shuffled = [...validReceivers].sort(() => Math.random() - 0.5);
    
    for (const receiver of shuffled) {
      if (!receiverToGiver.has(receiver)) {
        assignments.set(giver, receiver);
        receiverToGiver.set(receiver, giver);
        if (findMatching(giverIndex + 1)) return true;
        assignments.delete(giver);
        receiverToGiver.delete(receiver);
      }
    }
    return false;
  }
  
  return findMatching(0) ? assignments : null;
}

// Test randomness by running multiple times and checking variety
function testRandomness(algorithm, name, participants, constraints, runs = 100) {
  const results = [];
  let successCount = 0;
  
  for (let i = 0; i < runs; i++) {
    const result = algorithm(participants, constraints);
    if (result) {
      successCount++;
      // Convert to string for comparison
      const assignmentStr = Array.from(result.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([g, r]) => `${g}→${r}`)
        .join(',');
      results.push(assignmentStr);
    }
  }
  
  const uniqueResults = new Set(results);
  const variety = uniqueResults.size;
  const varietyPercent = ((variety / successCount) * 100).toFixed(1);
  
  console.log(`${name}:`);
  console.log(`  Success rate: ${successCount}/${runs} (${(successCount/runs*100).toFixed(1)}%)`);
  console.log(`  Unique assignments: ${variety}/${successCount} (${varietyPercent}%)`);
  console.log(`  Randomness: ${varietyPercent >= 80 ? '✅ High' : varietyPercent >= 50 ? '⚠️  Moderate' : '❌ Low'}`);
  console.log('');
  
  return { successCount, variety, varietyPercent };
}

// Run tests
console.log('🎲 Testing Randomness of Algorithms\n');
console.log('Running each algorithm 100 times with same participants/constraints...\n');
console.log('='.repeat(70));

const participants = loadParticipants();
const constraints = buildConstraintMap(participants);

testRandomness(greedyRandom, '1. Greedy Random', participants, constraints);
testRandomness(backtracking, '2. Backtracking', participants, constraints);
testRandomness(shuffleAndVerify, '3. Shuffle & Verify', participants, constraints);
testRandomness(mrvHeuristic, '4. MRV Heuristic', participants, constraints);
testRandomness(graphBasedMatching, '5. Graph-based Matching', participants, constraints);

console.log('='.repeat(70));
console.log('\n💡 Note: Higher variety = more random results each year');

