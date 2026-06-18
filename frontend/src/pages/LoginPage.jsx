import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import Navbar from '../components/Navbar';
import clockGuardLogo from '../assets/CGlogo.png';
import api from '../services/apiClient';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.auth.login({ username, password });

      if (response.data?.two_factor_required) {
        sessionStorage.setItem('temp_token', response.data.temp_token);
        navigate('/2fa');
        return;
      }

      if (response.success) {
        navigate('/dashboard');
        return;
      }

      setError('Unexpected login response.');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-vignette" aria-hidden="true" />

      <Navbar variant="public" />

      <main className="login-stage">
        <p className="login-eyebrow">
          <span className="login-eyebrow-line" />
          <span className="login-eyebrow-text">[ 01 ] - ADMIN SIGN IN</span>
        </p>

        <img src={clockGuardLogo} alt="ClockGuard" className="login-logo" />

        <h1 className="login-display">
          CLOCK<span className="display-title--chrome">GUARD</span>
        </h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              id="username"
              className="login-input"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-submit">
            Enter Console
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="login-footnote">
          ATTENDANCE, ROSTER, AND PAYROLL MANAGEMENT
        </p>
      </main>
    </div>
  );
}

export default LoginPage;
