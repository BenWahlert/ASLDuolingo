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
    return <div className="loading">Loading profile...</div>;
  }

  const earnedAchievementIds = achievements.map(a => a.achievement_id);
  const levelProgress = getCurrentLevelProgress(user.total_xp, user.current_level);
  const xpToNextLevel = getXpForNextLevel(user.total_xp, user.current_level);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Progress</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Level</h3>
          <div className="stat-big">{user.current_level}</div>
          {xpToNextLevel && (
            <div className="level-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <p>{xpToNextLevel} XP to Level {user.current_level + 1}</p>
            </div>
          )}
        </div>

        <div className="stat-card">
          <h3>Total XP</h3>
          <div className="stat-big">{user.total_xp}</div>
        </div>

        <div className="stat-card">
          <h3>Current Streak</h3>
          <div className="stat-big">{user.current_streak} 🔥</div>
        </div>

        <div className="stat-card">
          <h3>Longest Streak</h3>
          <div className="stat-big">{user.longest_streak} 🔥</div>
        </div>
      </div>

      <div className="achievements-section">
        <h2>Achievements ({achievements.length} / {allAchievements.length})</h2>

        <div className="achievements-grid">
          {allAchievements.map(achievement => {
            const earned = earnedAchievementIds.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`achievement-card ${earned ? 'earned' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {earned ? '🏆' : '🔒'}
                </div>
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Profile;
