export interface Participant {
  name: string;
  notAllowedNames: string[];
}

export interface Assignment {
  giver: string;
  receiver: string;
}

/**
 * Creates a map of name -> notAllowedNames for quick lookup
 */
function buildConstraintMap(participants: Participant[]) {
  const constraints = new Map<string, Set<string>>();
  for (const participant of participants) {
    constraints.set(participant.name, new Set(participant.notAllowedNames));
  }
  return constraints;
}

/**
 * Checks if an assignment is valid
 */
function isValidAssignment(
  giver: string,
  receiver: string,
  constraints: Map<string, Set<string>>
): boolean {
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
function attemptAssignment(participants: Participant[]): Map<string, string> | null {
  const constraints = buildConstraintMap(participants);
  const assignments = new Map<string, string>(); // giver -> receiver mapping
  const assignedReceivers = new Set<string>(); // Track which receivers have been assigned

  for (const giver of participants) {
    const availableReceivers = participants
      .map((p) => p.name)
      .filter(
        (receiver) =>
          !assignedReceivers.has(receiver) &&
          isValidAssignment(giver.name, receiver, constraints)
      );

    if (availableReceivers.length === 0) {
      // No valid options available
      return null;
    }

    // Randomly select from valid receivers
    const selectedReceiver =
      availableReceivers[Math.floor(Math.random() * availableReceivers.length)];
    assignments.set(giver.name, selectedReceiver);
    assignedReceivers.add(selectedReceiver);
  }

  return assignments;
}

/**
 * Main function to generate secret santa assignments
 */
export function generateSecretSanta(
  participants: Participant[]
): { assignments: Assignment[]; attempts: number } {
  if (participants.length < 2) {
    throw new Error('Need at least 2 participants');
  }

  const maxAttempts = 100;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    const assignmentsMap = attemptAssignment(participants);

    if (assignmentsMap !== null) {
      // Convert Map to array of Assignment objects
      const assignments: Assignment[] = Array.from(assignmentsMap.entries()).map(
        ([giver, receiver]) => ({
          giver,
          receiver,
        })
      );

      return { assignments, attempts };
    }
  }

  // If we get here, we've exhausted all attempts
  throw new Error(
    `Failed to generate valid secret santa assignments after ${maxAttempts} attempts. ` +
      `The constraints may be too restrictive. Please review the notAllowedNames.`
  );
}

