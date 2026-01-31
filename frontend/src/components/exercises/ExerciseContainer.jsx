import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import MultipleChoice from './MultipleChoice';
import Matching from './Matching';
import SignRecognition from './SignRecognition';
import './ExerciseContainer.css';

function ExerciseContainer({ lesson, exercises }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [totalXp, setTotalXp] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { submitExercise, completeLesson } = useProgress();
  const navigate = useNavigate();

  const currentExercise = exercises[currentIndex];

  const handleSubmit = async (answer) => {
    try {
      const result = await submitExercise(currentExercise.id, answer, attempts);

      if (result.correct) {
        setFeedback({ type: 'correct', xp: result.xpEarned });
        setTotalXp(prev => prev + result.xpEarned);

        setTimeout(() => {
          if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setAttempts(1);
            setFeedback(null);
          } else {
            handleLessonComplete();
          }
        }, 1500);
      } else {
        setFeedback({ type: 'incorrect', correctAnswer: result.correctAnswer });
        setAttempts(prev => prev + 1);
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Something went wrong' });
    }
  };

  const handleLessonComplete = async () => {
    try {
      const result = await completeLesson(lesson.id);
      setTotalXp(prev => prev + result.xpEarned);
      setCompleted(true);
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    }
  };

  if (completed) {
    return (
      <section className="lesson-complete" role="status" aria-live="polite">
        <h1>Lesson Complete!</h1>
        <div className="completion-stats">
          <div className="stat-item">
            <span className="stat-label">Total XP Earned</span>
            <span className="stat-value">{totalXp}</span>
          </div>
        </div>
        <button onClick={() => navigate('/learn')} className="btn-primary" aria-label="Continue to learning path">
          Continue Learning
        </button>
      </section>
    );
  }

  const renderExercise = () => {
    switch (currentExercise.type) {
      case 'multiple_choice':
        return <MultipleChoice key={currentExercise.id} exercise={currentExercise} onSubmit={handleSubmit} attempts={attempts} />;
      case 'matching':
        return <Matching key={currentExercise.id} exercise={currentExercise} onSubmit={handleSubmit} attempts={attempts} />;
      case 'sign_recognition':
        return <SignRecognition key={currentExercise.id} exercise={currentExercise} onSubmit={handleSubmit} attempts={attempts} />;
      default:
        return <div>Unknown exercise type</div>;
    }
  };

  return (
    <main className="exercise-container">
      <header className="exercise-header">
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={exercises.length}
          aria-label={`Exercise progress: ${currentIndex + 1} of ${exercises.length}`}
        >
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
          />
        </div>
        <span className="exercise-counter" aria-hidden="true">
          {currentIndex + 1} / {exercises.length}
        </span>
      </header>

      {renderExercise()}

      {feedback && (
        <div
          className={`feedback feedback-${feedback.type}`}
          role="alert"
          aria-live="assertive"
        >
          {feedback.type === 'correct' ? (
            <div>
              <p>Correct! +{feedback.xp} XP</p>
            </div>
          ) : feedback.type === 'incorrect' ? (
            <div>
              <p>Incorrect. Try again!</p>
              {feedback.correctAnswer && (
                <p>The correct answer is: {feedback.correctAnswer}</p>
              )}
            </div>
          ) : (
            <p>{feedback.message}</p>
          )}
        </div>
      )}
    </main>
  );
}

ExerciseContainer.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ExerciseContainer;
