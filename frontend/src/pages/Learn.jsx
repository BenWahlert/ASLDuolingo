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
    return <div className="loading">Loading lessons...</div>;
  }

  return (
    <div className="learn-page">
      <div className="learn-header">
        <h1>Your Learning Path</h1>
        <div className="user-stats">
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{user?.current_level}</span>
          </div>
          <div className="stat">
            <span className="stat-label">XP</span>
            <span className="stat-value">{user?.total_xp}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Streak</span>
            <span className="stat-value">{user?.current_streak}🔥</span>
          </div>
        </div>
      </div>

      <LessonPath lessons={lessons} />
    </div>
  );
}

export default Learn;
