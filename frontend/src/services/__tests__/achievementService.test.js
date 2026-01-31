import { describe, it, expect } from 'vitest';
import { checkAndAwardAchievements } from '../achievementService';

describe('achievementService', () => {
  describe('checkAndAwardAchievements', () => {
    it('should return empty array when no achievements are earned', () => {
      const userData = { total_xp: 50, current_streak: 1 };
      const progressData = {};
      const earnedAchievements = {};
      const allAchievements = [
        { id: 'ach-1', requirement_type: 'total_xp', requirement_value: 100 }
      ];

      const result = checkAndAwardAchievements(
        userData,
        progressData,
        earnedAchievements,
        allAchievements
      );

      expect(result).toEqual([]);
    });

    it('should detect total_xp achievement', () => {
      const userData = { total_xp: 150, current_streak: 1 };
      const progressData = {};
      const earnedAchievements = {};
      const allAchievements = [
        { id: 'ach-1', requirement_type: 'total_xp', requirement_value: 100, name: 'XP Master' }
      ];

      const result = checkAndAwardAchievements(
        userData,
        progressData,
        earnedAchievements,
        allAchievements
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('ach-1');
    });

    it('should detect streak_days achievement', () => {
      const userData = { total_xp: 50, current_streak: 7 };
      const progressData = {};
      const earnedAchievements = {};
      const allAchievements = [
        { id: 'ach-2', requirement_type: 'streak_days', requirement_value: 7, name: 'Week Warrior' }
      ];

      const result = checkAndAwardAchievements(
        userData,
        progressData,
        earnedAchievements,
        allAchievements
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('ach-2');
    });

    it('should detect lessons_completed achievement', () => {
      const userData = { total_xp: 50, current_streak: 1 };
      const progressData = {
        'lesson-1': { status: 'completed' },
        'lesson-2': { status: 'completed' },
        'lesson-3': { status: 'completed' }
      };
      const earnedAchievements = {};
      const allAchievements = [
        { id: 'ach-3', requirement_type: 'lessons_completed', requirement_value: 3, name: 'Learner' }
      ];

      const result = checkAndAwardAchievements(
        userData,
        progressData,
        earnedAchievements,
        allAchievements
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('ach-3');
    });

    it('should not return already earned achievements', () => {
      const userData = { total_xp: 150, current_streak: 1 };
      const progressData = {};
      const earnedAchievements = { 'ach-1': true };
      const allAchievements = [
        { id: 'ach-1', requirement_type: 'total_xp', requirement_value: 100 }
      ];

      const result = checkAndAwardAchievements(
        userData,
        progressData,
        earnedAchievements,
        allAchievements
      );

      expect(result).toEqual([]);
    });

    it('should return multiple newly earned achievements', () => {
      const userData = { total_xp: 150, current_streak: 7 };
      const progressData = {};
      const earnedAchievements = {};
      const allAchievements = [
        { id: 'ach-1', requirement_type: 'total_xp', requirement_value: 100 },
        { id: 'ach-2', requirement_type: 'streak_days', requirement_value: 7 }
      ];

      const result = checkAndAwardAchievements(
        userData,
        progressData,
        earnedAchievements,
        allAchievements
      );

      expect(result).toHaveLength(2);
    });

    it('should not award achievement if requirement not met', () => {
      const userData = { total_xp: 50, current_streak: 3 };
      const progressData = {};
      const earnedAchievements = {};
      const allAchievements = [
        { id: 'ach-1', requirement_type: 'total_xp', requirement_value: 100 },
        { id: 'ach-2', requirement_type: 'streak_days', requirement_value: 7 }
      ];

      const result = checkAndAwardAchievements(
        userData,
        progressData,
        earnedAchievements,
        allAchievements
      );

      expect(result).toEqual([]);
    });
  });
});
