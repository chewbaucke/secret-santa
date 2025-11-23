import { Participant, Assignment } from './secret-santa';

function getStorageKey(userId: string | undefined, baseKey: string): string {
  if (!userId) {
    return baseKey;
  }
  return `${baseKey}-${userId}`;
}

export function loadParticipantsFromStorage(userId?: string): Participant[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const key = getStorageKey(userId, 'secret-santa-participants');
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading participants from localStorage:', error);
  }

  return [];
}

export function saveParticipantsToStorage(participants: Participant[], userId?: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = getStorageKey(userId, 'secret-santa-participants');
    localStorage.setItem(key, JSON.stringify(participants));
  } catch (error) {
    console.error('Error saving participants to localStorage:', error);
  }
}

export function loadAssignmentsFromStorage(userId?: string): Assignment[] | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const key = getStorageKey(userId, 'secret-santa-assignments');
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading assignments from localStorage:', error);
  }

  return null;
}

export function saveAssignmentsToStorage(assignments: Assignment[], userId?: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = getStorageKey(userId, 'secret-santa-assignments');
    localStorage.setItem(key, JSON.stringify(assignments));
  } catch (error) {
    console.error('Error saving assignments to localStorage:', error);
  }
}

export function clearAssignmentsFromStorage(userId?: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = getStorageKey(userId, 'secret-santa-assignments');
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing assignments from localStorage:', error);
  }
}

