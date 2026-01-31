import { Link } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import './Navbar.css';

function Navbar() {
  const { user } = useProgress();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="navbar-content">
        <Link to="/learn" className="navbar-logo" aria-label="ASL Learn home">
          ASL Learn
        </Link>

        <div className="navbar-menu" role="menubar">
          <Link to="/learn" className="navbar-link" role="menuitem">Learn</Link>
          <Link to="/profile" className="navbar-link" role="menuitem">Profile</Link>
          <div className="navbar-user" aria-label="User progress">
            <span className="user-level" aria-label={`Current level: ${user?.current_level}`}>
              Level {user?.current_level}
            </span>
            <span className="user-xp" aria-label={`Total experience points: ${user?.total_xp}`}>
              {user?.total_xp} XP
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
