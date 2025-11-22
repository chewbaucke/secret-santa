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
  // Can't assign to self
  if (giver === receiver) {
    return false;
  }
  
  // Check if receiver is in giver's notAllowedNames
  const notAllowed = constraints.get(giver);
  if (notAllowed && notAllowed.has(receiver)) {
    return false;
  }
  
  return true;
}

/**
 * Attempts to create a valid secret santa assignment
 * Returns null if no valid assignment can be found
 */
function attemptAssignment(participants, constraints) {
  const assignments = new Map(); // giver -> receiver mapping
  const assignedReceivers = new Set(); // Track which receivers have been assigned
  
  for (const giver of participants) {
    const availableReceivers = participants
      .map(p => p.name)
      .filter(receiver => 
        !assignedReceivers.has(receiver) && 
        isValidAssignment(giver.name, receiver, constraints)
      );
    
    if (availableReceivers.length === 0) {
      // No valid options available
      return null;
    }
    
    // Randomly select from valid receivers
    const selectedReceiver = availableReceivers[Math.floor(Math.random() * availableReceivers.length)];
    assignments.set(giver.name, selectedReceiver);
    assignedReceivers.add(selectedReceiver);
  }
  
  return assignments;
}

/**
 * Main function to generate secret santa assignments
 */
function generateSecretSanta() {
  const participants = loadParticipants();
  const constraints = buildConstraintMap(participants);
  
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    const assignments = attemptAssignment(participants, constraints);
    
    if (assignments !== null) {
      // Success! Display the assignments
      console.log('\n🎄 Secret Santa Assignments 🎄\n');
      console.log('='.repeat(50));
      
      for (const [giver, receiver] of assignments.entries()) {
        console.log(`${giver} → ${receiver}`);
      }
      
      console.log('='.repeat(50));
      console.log(`\n✅ Successfully generated assignments after ${attempts} attempt(s)\n`);
      return assignments;
    } else {
      console.error(`⚠️  Attempt ${attempts}: No valid assignment found, retrying...`);
    }
  }
  
  // If we get here, we've exhausted all attempts
  const error = new Error(
    `Failed to generate valid secret santa assignments after ${maxAttempts} attempts. ` +
    `The constraints may be too restrictive. Please review the notAllowedNames in participants.json.`
  );
  throw error;
}

// Run the script
try {
  generateSecretSanta();
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}

