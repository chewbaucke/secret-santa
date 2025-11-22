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

function generateSecretSanta() {
  const participants = loadParticipants();
  const constraints = buildConstraintMap(participants);
  
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    attempts++;
    const assignments = greedyRandom(participants, constraints);
    
    if (assignments !== null) {
      return assignments;
    }
  }
  
  throw new Error('Failed after 100 attempts');
}

console.log('🎲 Demonstrating Randomness: Running 3 times with same input\n');
console.log('='.repeat(60));

for (let i = 1; i <= 3; i++) {
  const assignments = generateSecretSanta();
  console.log(`\nRun ${i}:`);
  console.log('-'.repeat(60));
  for (const [giver, receiver] of Array.from(assignments.entries()).sort()) {
    console.log(`  ${giver} → ${receiver}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('\n✅ Notice how each run produces different assignments!');
console.log('   This ensures Secret Santa is different every year.\n');

