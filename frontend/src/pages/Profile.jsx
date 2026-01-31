import { useEffect, useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import * as dataService from '../services/dataService';
import { getCurrentLevelProgress, getXpForNextLevel } from '../utils/xpCalculator';
import './Profile.css';

function Profile() {
  const { user, loadUserStats } = useProgress();
  const [achievements, setAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        await loadUserStats();

        const userAchievementsData = dataService.getUserAchievements();
        const allAchievementsData = dataService.getAllAchievements();

        if (cancelled) return;

        setAchievements(userAchievementsData);
        setAllAchievements(allAchievementsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load achievements:', error);
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="loading" role="status" aria-live="polite">Loading profile...</div>;
  }

  const earnedAchievementIds = achievements.map(a => a.achievement_id);
  const levelProgress = getCurrentLevelProgress(user.total_xp, user.current_level);
  const xpToNextLevel = getXpForNextLevel(user.total_xp, user.current_level);

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>My Progress</h1>
      </header>

      <section className="stats-grid" aria-label="User statistics">
        <article className="stat-card">
          <h3>Level</h3>
          <div className="stat-big" aria-label={`Level ${user.current_level}`}>{user.current_level}</div>
          {xpToNextLevel && (
            <div className="level-progress">
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow={levelProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progress to next level: ${levelProgress}%`}
              >
                <div
                  className="progress-fill"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <p>{xpToNextLevel} XP to Level {user.current_level + 1}</p>
            </div>
          )}
        </article>

        <article className="stat-card">
          <h3>Total XP</h3>
          <div className="stat-big" aria-label={`Total experience points: ${user.total_xp}`}>{user.total_xp}</div>
        </article>

        <article className="stat-card">
          <h3>Current Streak</h3>
          <div className="stat-big" aria-label={`Current streak: ${user.current_streak} days`}>
            {user.current_streak} <span aria-hidden="true">🔥</span>
          </div>
        </article>

        <article className="stat-card">
          <h3>Longest Streak</h3>
          <div className="stat-big" aria-label={`Longest streak: ${user.longest_streak} days`}>
            {user.longest_streak} <span aria-hidden="true">🔥</span>
          </div>
        </article>
      </section>

      <section className="achievements-section" aria-label="Achievements">
        <h2>Achievements ({achievements.length} / {allAchievements.length})</h2>

        <div className="achievements-grid">
          {allAchievements.map(achievement => {
            const earned = earnedAchievementIds.includes(achievement.id);
            return (
              <article
                key={achievement.id}
                className={`achievement-card ${earned ? 'earned' : 'locked'}`}
                aria-label={`${achievement.name}: ${earned ? 'Earned' : 'Locked'}`}
              >
                <div className="achievement-icon" aria-hidden="true">
                  {earned ? '🏆' : '🔒'}
                </div>
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Profile;
