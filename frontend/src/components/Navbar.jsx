import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import clockGuardLogo from '../assets/CGlogo.png';

function Navbar({ variant = 'app' }) {
  const navigate = useNavigate();
  const isPublic = variant === 'public';

  const handleLogout = () => {
    console.log('Logout clicked');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to={isPublic ? '/about' : '/dashboard'} className="navbar-logo">
          <img src={clockGuardLogo} alt="" />
          <span className="navbar-brand">
            CLOCK<span className="display-title--chrome">GUARD</span>
          </span>
        </NavLink>

        <div className="navbar-actions">
          {isPublic ? (
            <div className="navbar-links" aria-label="Public navigation">
              <NavLink to="/about" className="navbar-link">
                About
              </NavLink>
              <NavLink to="/login" className="navbar-link">
                Sign In
              </NavLink>
              <NavLink to="/settings" className="navbar-link">
                Settings
              </NavLink>
            </div>
          ) : (
            <button
              type="button"
              className="btn-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
