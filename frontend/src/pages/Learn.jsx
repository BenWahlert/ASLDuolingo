import { useEffect, useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import LessonPath from '../components/lessons/LessonPath';
import './Learn.css';

function Learn() {
  const { lessons, user, loadLessons, loadUserStats } = useProgress();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadLessons(), loadUserStats()])
      .then(() => {
        if (!cancelled) setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="loading" role="status" aria-live="polite">Loading lessons...</div>;
  }

  return (
    <div className="learn-page">
      <header className="learn-header">
        <h1>Your Learning Path</h1>
        <div className="user-stats" role="region" aria-label="User statistics">
          <div className="stat">
            <span className="stat-label" id="level-label">Level</span>
            <span className="stat-value" aria-labelledby="level-label">{user?.current_level}</span>
          </div>
          <div className="stat">
            <span className="stat-label" id="xp-label">XP</span>
            <span className="stat-value" aria-labelledby="xp-label">{user?.total_xp}</span>
          </div>
          <div className="stat">
            <span className="stat-label" id="streak-label">Streak</span>
            <span className="stat-value" aria-labelledby="streak-label">
              {user?.current_streak}<span aria-label="day streak">🔥</span>
            </span>
          </div>
        </div>
      </header>

      <section aria-label="Available lessons">
        <LessonPath lessons={lessons} />
      </section>
    </div>
  );
}

export default Learn;
