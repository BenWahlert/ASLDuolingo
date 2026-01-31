import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Exercise.css';
import { getAssetPath } from '../../utils/assetPath';

function MultipleChoice({ exercise, onSubmit, attempts }) {
  const [selected, setSelected] = useState('');

  const shuffledOptions = useMemo(() => {
    const options = exercise.options || [];
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [exercise.id]);

  useEffect(() => {
    setSelected('');
  }, [exercise.id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (key >= '1' && key <= '4') {
        const index = parseInt(key) - 1;
        if (shuffledOptions[index]) {
          setSelected(shuffledOptions[index]);
        }
      } else if (key === 'Enter' && selected) {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shuffledOptions, selected]);

  const handleSubmit = () => {
    if (selected) {
      onSubmit(selected);
    }
  };

  return (
    <section className="exercise multiple-choice" role="region" aria-label="Multiple choice exercise">
      <h2 id="question-text">{exercise.question_text}</h2>

      {exercise.image_url && (
        <div className="exercise-image">
          <img
            src={getAssetPath(exercise.image_url)}
            alt={`ASL sign for ${exercise.correct_answer || 'the answer'}`}
          />
        </div>
      )}

      <div className="options" role="group" aria-labelledby="question-text">
        {shuffledOptions.map((option, index) => (
          <button
            key={index}
            className={`option ${selected === option ? 'selected' : ''}`}
            onClick={() => setSelected(option)}
            aria-label={`Select answer: ${option}`}
            aria-pressed={selected === option}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        className="btn-primary btn-submit"
        onClick={handleSubmit}
        disabled={!selected}
        aria-label="Check your answer"
      >
        Check Answer
      </button>
    </section>
  );
}

MultipleChoice.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.string.isRequired,
    question_text: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    correct_answer: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  attempts: PropTypes.number.isRequired
};

export default MultipleChoice;
