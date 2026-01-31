import { describe, it, expect } from 'vitest';
import { calculateLevel, addXp, getXpForNextLevel } from '../xpService';

describe('xpService', () => {
  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('should return level 1 for XP below 100', () => {
      expect(calculateLevel(50)).toBe(1);
      expect(calculateLevel(99)).toBe(1);
    });

    it('should return level 2 for 100 XP', () => {
      expect(calculateLevel(100)).toBe(2);
    });

    it('should return level 3 for 250 XP', () => {
      expect(calculateLevel(250)).toBe(3);
    });

    it('should return level 4 for 500 XP', () => {
      expect(calculateLevel(500)).toBe(4);
    });

    it('should return level 5 for 1000 XP', () => {
      expect(calculateLevel(1000)).toBe(5);
    });

    it('should handle large XP values', () => {
      expect(calculateLevel(10000)).toBeGreaterThan(5);
    });
  });

  describe('addXp', () => {
    it('should add XP to user total', () => {
      const user = { total_xp: 50, current_level: 1 };
      const result = addXp(user, 30);

      expect(result.newTotalXp).toBe(80);
      expect(result.xpAdded).toBe(30);
      expect(user.total_xp).toBe(80);
    });

    it('should detect level up when crossing threshold', () => {
      const user = { total_xp: 90, current_level: 1 };
      const result = addXp(user, 20);

      expect(result.newLevel).toBe(2);
      expect(result.leveledUp).toBe(true);
      expect(user.current_level).toBe(2);
    });

    it('should not indicate level up when staying in same level', () => {
      const user = { total_xp: 50, current_level: 1 };
      const result = addXp(user, 30);

      expect(result.leveledUp).toBe(false);
      expect(result.newLevel).toBe(1);
    });

    it('should handle multiple level jumps', () => {
      const user = { total_xp: 50, current_level: 1 };
      const result = addXp(user, 500);

      expect(result.newTotalXp).toBe(550);
      expect(result.newLevel).toBe(4);
      expect(result.leveledUp).toBe(true);
    });
  });

  describe('getXpForNextLevel', () => {
    it('should calculate XP needed for next level', () => {
      expect(getXpForNextLevel(50)).toBe(50);
      expect(getXpForNextLevel(150)).toBe(100);
    });

    it('should return 0 when at exact threshold', () => {
      expect(getXpForNextLevel(100)).toBe(150);
    });

    it('should return null when at max level', () => {
      const result = getXpForNextLevel(100000);
      expect(result).toBeNull();
    });
  });
});
