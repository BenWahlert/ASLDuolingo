import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import ExerciseContainer from '../components/exercises/ExerciseContainer';
import './Lesson.css';

function Lesson() {
  const { id } = useParams();
  const { loadLesson, loadExercises, startLesson } = useProgress();
  const [lesson, setLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const [lessonData, exercisesData] = await Promise.all([
          loadLesson(id),
          loadExercises(id)
        ]);

        if (cancelled) return;

        if (!lessonData.unlocked) {
          setError('This lesson is locked. Complete previous lessons to unlock.');
          return;
        }

        setLesson(lessonData);
        setExercises(shuffleArray(exercisesData));

        await startLesson(id);

        if (cancelled) return;

        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load lesson');
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="loading">Loading lesson...</div>;
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>{error}</h2>
        <button onClick={() => navigate('/learn')} className="btn-primary">
          Back to Learning Path
        </button>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      <div className="lesson-header">
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
      </div>

      <ExerciseContainer lesson={lesson} exercises={exercises} />
    </div>
  );
}

export default Lesson;
