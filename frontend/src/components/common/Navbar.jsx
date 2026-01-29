import { Link } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import './Navbar.css';

function Navbar() {
  const { user } = useProgress();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/learn" className="navbar-logo">
          ASL Learn
        </Link>

        <div className="navbar-menu">
          <Link to="/learn" className="navbar-link">Learn</Link>
          <Link to="/profile" className="navbar-link">Profile</Link>
          <div className="navbar-user">
            <span className="user-level">Level {user?.current_level}</span>
            <span className="user-xp">{user?.total_xp} XP</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
