import { describe, it, expect } from 'vitest';
import { calculateTimer, sortChakrasByProgress } from '../src/timer-logic';
import { chakras } from '../src/chakras';

describe('Timer Logic', () => {
  describe('calculateTimer', () => {
    it('should calculate timer as 11 - progress', () => {
      expect(calculateTimer(11)).toBe(1); // 11 - 11 = 0 -> 1
      expect(calculateTimer(1)).toBe(10); // 11 - 1 = 10
      expect(calculateTimer(6)).toBe(5);  // 11 - 6 = 5
    });

    it('should return 1 if progress is 11', () => {
      expect(calculateTimer(11)).toBe(1);
    });
  });

  describe('sortChakrasByProgress', () => {
    it('should sort chakras based on progress values in ascending order', () => {
      // Mock progress values: Root (11), Sacral (1), Solar (6)
      // Original order: Root, Sacral, Solar, Heart, Throat, Third Eye, Crown
      const progressValues = [11, 1, 6, 11, 11, 11, 11];
      const sorted = sortChakrasByProgress(chakras, progressValues);
      
      expect(sorted[0].name).toBe('Sacral chakra'); // Progress 1
      expect(sorted[1].name).toBe('Solar plexus chakra'); // Progress 6
      expect(sorted[2].name).toBe('Root Chakra'); // Progress 11 (first in original)
    });
  });
});
