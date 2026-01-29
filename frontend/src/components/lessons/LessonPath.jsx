import LessonCard from './LessonCard';
import './LessonPath.css';

function LessonPath({ lessons }) {
  return (
    <div className="lesson-path">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="lesson-path-item">
          <LessonCard lesson={lesson} />
          {lesson.order_index < lessons.length && (
            <div className="lesson-connector" />
          )}
        </div>
      ))}
    </div>
  );
}

export default LessonPath;
