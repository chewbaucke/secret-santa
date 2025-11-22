import { Participant } from './secret-santa';

const STORAGE_KEY = 'secret-santa-participants';

export function loadParticipantsFromStorage(): Participant[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  return [];
}

export function saveParticipantsToStorage(participants: Participant[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

