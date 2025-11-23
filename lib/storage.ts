import { Participant, Assignment } from './secret-santa';

const PARTICIPANTS_STORAGE_KEY = 'secret-santa-participants';
const ASSIGNMENTS_STORAGE_KEY = 'secret-santa-assignments';

export function loadParticipantsFromStorage(): Participant[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(PARTICIPANTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading participants from localStorage:', error);
  }

  return [];
}

export function saveParticipantsToStorage(participants: Participant[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(PARTICIPANTS_STORAGE_KEY, JSON.stringify(participants));
  } catch (error) {
    console.error('Error saving participants to localStorage:', error);
  }
}

export function loadAssignmentsFromStorage(): Assignment[] | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading assignments from localStorage:', error);
  }

  return null;
}

export function saveAssignmentsToStorage(assignments: Assignment[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.error('Error saving assignments to localStorage:', error);
  }
}

export function clearAssignmentsFromStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(ASSIGNMENTS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing assignments from localStorage:', error);
  }
}

