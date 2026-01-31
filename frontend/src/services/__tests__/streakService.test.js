import { describe, it, expect, beforeEach } from 'vitest';
import { updateStreak } from '../streakService';

describe('streakService', () => {
  let userData;

  beforeEach(() => {
    userData = {
      current_streak: 0,
      longest_streak: 0,
      last_practice_date: null,
      total_xp: 0,
      current_level: 1
    };
  });

  describe('updateStreak', () => {
    it('should initialize streak to 1 for first practice', () => {
      const result = updateStreak(userData);

      expect(result.streakIncreased).toBe(true);
      expect(result.currentStreak).toBe(1);
      expect(result.xpEarned).toBe(0);
      expect(userData.current_streak).toBe(1);
      expect(userData.last_practice_date).toBeTruthy();
    });

    it('should not increase streak when practicing same day', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      userData.last_practice_date = today.toISOString();
      userData.current_streak = 3;

      const result = updateStreak(userData);

      expect(result.streakIncreased).toBe(false);
      expect(result.currentStreak).toBe(3);
      expect(result.xpEarned).toBe(0);
    });

    it('should increase streak when practicing consecutive days', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      userData.last_practice_date = yesterday.toISOString();
      userData.current_streak = 3;
      userData.longest_streak = 3;

      const result = updateStreak(userData);

      expect(result.streakIncreased).toBe(true);
      expect(result.currentStreak).toBe(4);
      expect(result.xpEarned).toBe(20);
      expect(userData.current_streak).toBe(4);
      expect(userData.longest_streak).toBe(4);
    });

    it('should update longest streak when current exceeds it', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      userData.last_practice_date = yesterday.toISOString();
      userData.current_streak = 5;
      userData.longest_streak = 3;

      updateStreak(userData);

      expect(userData.longest_streak).toBe(6);
    });

    it('should reset streak to 1 when gap is more than 1 day', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      threeDaysAgo.setHours(0, 0, 0, 0);
      userData.last_practice_date = threeDaysAgo.toISOString();
      userData.current_streak = 5;
      userData.longest_streak = 5;

      const result = updateStreak(userData);

      expect(result.streakIncreased).toBe(false);
      expect(result.currentStreak).toBe(1);
      expect(result.streakReset).toBe(true);
      expect(result.xpEarned).toBe(0);
      expect(userData.current_streak).toBe(1);
      expect(userData.longest_streak).toBe(5);
    });

    it('should award 20 XP for streak continuation', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      userData.last_practice_date = yesterday.toISOString();
      userData.current_streak = 1;
      userData.total_xp = 50;
      userData.current_level = 1;

      const result = updateStreak(userData);

      expect(result.xpEarned).toBe(20);
      expect(userData.total_xp).toBe(70);
    });
  });
});
