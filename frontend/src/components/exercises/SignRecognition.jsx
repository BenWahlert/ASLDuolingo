import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Exercise.css';
import { getAssetPath } from '../../utils/assetPath';

function SignRecognition({ exercise, onSubmit, attempts }) {
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
          setSelected(shuffledOptions[index].image_url);
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
    <section className="exercise sign-recognition" role="region" aria-label="Sign recognition exercise">
      <h2 id="question-text">{exercise.question_text}</h2>

      <div className="image-options" role="group" aria-labelledby="question-text">
        {shuffledOptions.map((option, index) => (
          <button
            key={index}
            className={`image-option ${selected === option.image_url ? 'selected' : ''}`}
            onClick={() => setSelected(option.image_url)}
            aria-label={`Select ASL sign option ${index + 1}`}
            aria-pressed={selected === option.image_url}
          >
            <img
              src={getAssetPath(option.image_url)}
              alt={`ASL sign option ${index + 1}`}
              role="presentation"
            />
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

SignRecognition.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.string.isRequired,
    question_text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      image_url: PropTypes.string.isRequired
    })).isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  attempts: PropTypes.number.isRequired
};

export default SignRecognition;
