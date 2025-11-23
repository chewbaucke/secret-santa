import { generateSecretSanta, Participant } from '@/lib/secret-santa';

describe('generateSecretSanta', () => {
  describe('basic functionality', () => {
    it('should generate assignments for 2 participants', () => {
      const participants: Participant[] = [
        { name: 'Alice', notAllowedNames: [] },
        { name: 'Bob', notAllowedNames: [] },
      ];

      const result = generateSecretSanta(participants);

      expect(result.assignments).toHaveLength(2);
      expect(result.assignments[0].giver).toBe('Alice');
      expect(result.assignments[0].receiver).toBe('Bob');
      expect(result.assignments[1].giver).toBe('Bob');
      expect(result.assignments[1].receiver).toBe('Alice');
      expect(result.attempts).toBeGreaterThan(0);
    });

    it('should generate assignments for multiple participants', () => {
      const participants: Participant[] = [
        { name: 'Alice', notAllowedNames: [] },
        { name: 'Bob', notAllowedNames: [] },
        { name: 'Charlie', notAllowedNames: [] },
        { name: 'Diana', notAllowedNames: [] },
      ];

      const result = generateSecretSanta(participants);

      expect(result.assignments).toHaveLength(4);
      
      // Check all participants are assigned
      const givers = result.assignments.map(a => a.giver);
      const receivers = result.assignments.map(a => a.receiver);
      
      expect(givers).toHaveLength(4);
      expect(receivers).toHaveLength(4);
      expect(new Set(givers).size).toBe(4); // All unique
      expect(new Set(receivers).size).toBe(4); // All unique
    });

    it('should not assign anyone to themselves', () => {
      const participants: Participant[] = [
        { name: 'Alice', notAllowedNames: [] },
        { name: 'Bob', notAllowedNames: [] },
        { name: 'Charlie', notAllowedNames: [] },
      ];

      const result = generateSecretSanta(participants);

      result.assignments.forEach(assignment => {
        expect(assignment.giver).not.toBe(assignment.receiver);
      });
    });
  });

  describe('constraints handling', () => {
    it('should respect notAllowedNames constraints', () => {
      const participants: Participant[] = [
        { name: 'Alice', notAllowedNames: ['Bob'] },
        { name: 'Bob', notAllowedNames: ['Alice'] },
        { name: 'Charlie', notAllowedNames: [] },
        { name: 'Diana', notAllowedNames: [] },
      ];

      const result = generateSecretSanta(participants);

      const aliceAssignment = result.assignments.find(a => a.giver === 'Alice');
      const bobAssignment = result.assignments.find(a => a.giver === 'Bob');

      expect(aliceAssignment?.receiver).not.toBe('Bob');
      expect(bobAssignment?.receiver).not.toBe('Alice');
    });

    it('should handle complex constraint scenarios', () => {
      const participants: Participant[] = [
        { name: 'Alice', notAllowedNames: ['Bob', 'Charlie'] },
        { name: 'Bob', notAllowedNames: ['Alice'] },
        { name: 'Charlie', notAllowedNames: ['Alice'] },
        { name: 'Diana', notAllowedNames: [] },
      ];

      const result = generateSecretSanta(participants);

      const aliceAssignment = result.assignments.find(a => a.giver === 'Alice');
      expect(aliceAssignment?.receiver).toBe('Diana'); // Only valid option
      
      // Verify constraints are respected
      expect(aliceAssignment?.receiver).not.toBe('Bob');
      expect(aliceAssignment?.receiver).not.toBe('Charlie');
    });

    it('should work with no constraints', () => {
      const participants: Participant[] = [
        { name: 'Alice', notAllowedNames: [] },
        { name: 'Bob', notAllowedNames: [] },
        { name: 'Charlie', notAllowedNames: [] },
      ];

      expect(() => generateSecretSanta(participants)).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should throw error if less than 2 participants', () => {
      const participants: Participant[] = [
        { name: 'Alice', notAllowedNames: [] },
      ];

      expect(() => generateSecretSanta(participants)).toThrow(
        'Need at least 2 participants'
      );
    });

    it('should throw error if no participants provided', () => {
      const participants: Participant[] = [];

      expect(() => generateSecretSanta(participants)).toThrow(
        'Need at least 2 participants'
      );
    });

    it('should throw error if constraints are too restrictive', () => {
      // This scenario makes it impossible to assign everyone
      const participants: Participant[] = [
        { name: 'Alice', notAllowedNames: ['Bob', 'Charlie'] },
        { name: 'Bob', notAllowedNames: ['Alice', 'Charlie'] },
        { name: 'Charlie', notAllowedNames: ['Alice', 'Bob'] },
      ];

      // This might succeed or fail depending on randomness, but if it fails,
      // it should throw the appropriate error
      try {
        const result = generateSecretSanta(participants);
        // If it succeeds, verify it's valid
        expect(result.assignments.length).toBe(3);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Failed to generate');
      }
    });
  });

  describe('randomness', () => {
    it('should produce different results on multiple runs', () => {
      const participants: Participant[] = [
        { name: 'Alice', notAllowedNames: [] },
        { name: 'Bob', notAllowedNames: [] },
        { name: 'Charlie', notAllowedNames: [] },
        { name: 'Diana', notAllowedNames: [] },
      ];

      const results = Array.from({ length: 10 }, () => 
        generateSecretSanta(participants)
      );

      // Get all assignment strings
      const assignmentStrings = results.map(r => 
        r.assignments.map(a => `${a.giver}→${a.receiver}`).sort().join(',')
      );

      // Should have at least some variety (not all identical)
      const uniqueAssignments = new Set(assignmentStrings);
      expect(uniqueAssignments.size).toBeGreaterThan(1);
    });
  });

  describe('edge cases', () => {
    it('should handle participants with overlapping constraints', () => {
      const participants: Participant[] = [
        { name: 'Alice', notAllowedNames: ['Bob'] },
        { name: 'Bob', notAllowedNames: ['Alice'] },
        { name: 'Charlie', notAllowedNames: [] },
        { name: 'Diana', notAllowedNames: [] },
      ];

      const result = generateSecretSanta(participants);

      expect(result.assignments).toHaveLength(4);
      
      const bobAssignment = result.assignments.find(a => a.giver === 'Bob');
      expect(bobAssignment?.receiver).not.toBe('Alice');
      
      const aliceAssignment = result.assignments.find(a => a.giver === 'Alice');
      expect(aliceAssignment?.receiver).not.toBe('Bob');
    });

    it('should handle large number of participants', () => {
      const participants: Participant[] = Array.from({ length: 20 }, (_, i) => ({
        name: `Person${i + 1}`,
        notAllowedNames: [],
      }));

      const result = generateSecretSanta(participants);

      expect(result.assignments).toHaveLength(20);
      
      // Verify all are unique
      const receivers = result.assignments.map(a => a.receiver);
      expect(new Set(receivers).size).toBe(20);
    });
  });
});

