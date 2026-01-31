import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Exercise.css';
import { getAssetPath } from '../../utils/assetPath';

function Matching({ exercise, onSubmit, attempts }) {
  const [matches, setMatches] = useState({});

  useEffect(() => {
    setMatches({});
  }, [exercise.id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        const allMatched = pairs.every(pair => matches[pair.image_url]);
        if (allMatched) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [matches]);

  const pairs = exercise.options || [];

  const handleMatch = (imageUrl, answer) => {
    setMatches(prev => ({ ...prev, [imageUrl]: answer }));
  };

  const handleSubmit = () => {
    const allMatched = pairs.every(pair => matches[pair.image_url]);
    if (allMatched) {
      const matchString = JSON.stringify(matches);
      onSubmit(matchString);
    }
  };

  return (
    <section className="exercise matching" role="region" aria-label="Matching exercise">
      <h2 id="question-text">{exercise.question_text}</h2>

      <div className="matching-pairs">
        {pairs.map((pair, index) => (
          <div key={index} className="matching-pair">
            <img
              src={getAssetPath(pair.image_url)}
              alt={`ASL sign ${index + 1}`}
              id={`sign-image-${index}`}
            />
            <select
              value={matches[pair.image_url] || ''}
              onChange={(e) => handleMatch(pair.image_url, e.target.value)}
              aria-label={`Match for ASL sign ${index + 1}`}
              aria-describedby={`sign-image-${index}`}
            >
              <option value="">Select a match...</option>
              {pairs.map((p, i) => (
                <option key={i} value={p.answer}>
                  {p.answer}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        className="btn-primary btn-submit"
        onClick={handleSubmit}
        disabled={pairs.length !== Object.keys(matches).length}
        aria-label="Check your answer"
      >
        Check Answer
      </button>
    </section>
  );
}

Matching.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.string.isRequired,
    question_text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      image_url: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired
    })).isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  attempts: PropTypes.number.isRequired
};

export default Matching;
