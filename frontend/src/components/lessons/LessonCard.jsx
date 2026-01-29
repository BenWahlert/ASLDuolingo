import { useNavigate } from 'react-router-dom';
import './LessonCard.css';

function LessonCard({ lesson }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (lesson.unlocked) {
      navigate(`/lesson/${lesson.id}`);
    }
  };

  const getStatus = () => {
    if (!lesson.unlocked) return 'locked';
    if (lesson.progress?.status === 'completed') return 'completed';
    if (lesson.progress?.status === 'in_progress') return 'in-progress';
    return 'available';
  };

  const status = getStatus();

  return (
    <div
      className={`lesson-card lesson-${status}`}
      onClick={handleClick}
      style={{ cursor: lesson.unlocked ? 'pointer' : 'not-allowed' }}
    >
      <div className="lesson-icon">
        {status === 'completed' ? '✓' : status === 'locked' ? '🔒' : '▶'}
      </div>
      <div className="lesson-info">
        <h3>{lesson.title}</h3>
        <p>{lesson.description}</p>
        {!lesson.unlocked && (
          <span className="required-xp">Requires {lesson.required_xp} XP</span>
        )}
      </div>
    </div>
  );
}

export default LessonCard;
