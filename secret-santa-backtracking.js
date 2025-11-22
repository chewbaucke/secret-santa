import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Reads participants from participants.json
 */
function loadParticipants() {
  const filePath = path.join(__dirname, 'participants.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Creates a map of name -> notAllowedNames for quick lookup
 */
function buildConstraintMap(participants) {
  const constraints = new Map();
  for (const participant of participants) {
    constraints.set(participant.name, new Set(participant.notAllowedNames));
  }
  return constraints;
}

/**
 * Checks if an assignment is valid
 */
function isValidAssignment(giver, receiver, constraints) {
  if (giver === receiver) return false;
  const notAllowed = constraints.get(giver);
  return !(notAllowed && notAllowed.has(receiver));
}

/**
 * Backtracking algorithm - guaranteed to find a solution if one exists
 * This is more efficient than the greedy approach for tight constraints
 */
function generateAssignments(participants, constraints) {
  const names = participants.map(p => p.name);
  const assignments = new Map();
  const assignedReceivers = new Set();
  
  function solve(index) {
    if (index === names.length) {
      return true; // All assigned successfully
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
      
      // Backtrack if this path doesn't lead to a solution
      assignments.delete(giver);
      assignedReceivers.delete(receiver);
    }
    
    return false;
  }
  
  return solve(0) ? assignments : null;
}

/**
 * Main function to generate secret santa assignments
 */
function generateSecretSanta() {
  const participants = loadParticipants();
  const constraints = buildConstraintMap(participants);
  
  const startTime = process.hrtime.bigint();
  const assignments = generateAssignments(participants, constraints);
  const endTime = process.hrtime.bigint();
  const durationMs = Number(endTime - startTime) / 1_000_000;
  
  if (assignments === null) {
    const error = new Error(
      'No valid secret santa assignment exists with the given constraints. ' +
      'Please review the notAllowedNames in participants.json.'
    );
    throw error;
  }
  
  // Success! Display the assignments
  console.log('\n🎄 Secret Santa Assignments 🎄\n');
  console.log('='.repeat(50));
  
  for (const [giver, receiver] of assignments.entries()) {
    console.log(`${giver} → ${receiver}`);
  }
  
  console.log('='.repeat(50));
  console.log(`\n✅ Generated using backtracking algorithm (${durationMs.toFixed(2)}ms)\n`);
  
  return assignments;
}

// Run the script
try {
  generateSecretSanta();
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}

