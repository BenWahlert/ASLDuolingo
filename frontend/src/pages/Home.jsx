import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Learn American Sign Language</h1>
        <p>Master ASL through interactive lessons and gamified learning</p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-primary btn-large">
            Get Started
          </Link>
          <Link to="/login" className="btn-secondary btn-large">
            Log In
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature">
          <h3>Interactive Lessons</h3>
          <p>Learn through engaging exercises that teach you ASL alphabet, numbers, and common phrases</p>
        </div>
        <div className="feature">
          <h3>Track Progress</h3>
          <p>Earn XP, level up, and maintain streaks as you progress through lessons</p>
        </div>
        <div className="feature">
          <h3>Earn Achievements</h3>
          <p>Unlock badges and rewards as you master new skills and reach milestones</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
