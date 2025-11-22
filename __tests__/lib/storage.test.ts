import {
  loadParticipantsFromStorage,
  saveParticipantsToStorage,
} from '@/lib/storage';
import { Participant } from '@/lib/secret-santa';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('storage utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('saveParticipantsToStorage', () => {
    it('should save participants to localStorage', () => {
      const participants: Participant[] = [
        { name: 'Alice', notAllowedNames: ['Bob'] },
        { name: 'Bob', notAllowedNames: ['Alice'] },
      ];

      saveParticipantsToStorage(participants);

      const stored = localStorageMock.getItem('secret-santa-participants');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual(participants);
    });

    it('should handle empty array', () => {
      saveParticipantsToStorage([]);

      const stored = localStorageMock.getItem('secret-santa-participants');
      expect(stored).toBe('[]');
    });

    it('should overwrite existing data', () => {
      const first: Participant[] = [
        { name: 'Alice', notAllowedNames: [] },
      ];
      const second: Participant[] = [
        { name: 'Bob', notAllowedNames: [] },
      ];

      saveParticipantsToStorage(first);
      saveParticipantsToStorage(second);

      const stored = localStorageMock.getItem('secret-santa-participants');
      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual(second);
    });
  });

  describe('loadParticipantsFromStorage', () => {
    it('should load participants from localStorage', () => {
      const participants: Participant[] = [
        { name: 'Alice', notAllowedNames: ['Bob'] },
        { name: 'Bob', notAllowedNames: ['Alice'] },
      ];

      localStorageMock.setItem(
        'secret-santa-participants',
        JSON.stringify(participants)
      );

      const loaded = loadParticipantsFromStorage();
      expect(loaded).toEqual(participants);
    });

    it('should return empty array if nothing stored', () => {
      const loaded = loadParticipantsFromStorage();
      expect(loaded).toEqual([]);
    });

    it('should return empty array if invalid JSON', () => {
      localStorageMock.setItem('secret-santa-participants', 'invalid json');

      // Should handle error gracefully
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const loaded = loadParticipantsFromStorage();
      
      expect(loaded).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

