import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';
import Navbar from '../components/Navbar';
import clockGuardLogo from '../assets/CGlogo.png';

const featureCards = [
  {
    label: '[ 01 ]',
    title: 'Biometric timekeeping',
    body: 'ClockGuard uses facial verification to help employees clock in and out without shared pins, paper sheets, or manager guesswork.',
  },
  {
    label: '[ 02 ]',
    title: 'Live employee visibility',
    body: 'Attendance logs, roster status, and recent activity are organized into a single management console for fast daily oversight.',
  },
  {
    label: '[ 03 ]',
    title: 'Automatic payroll flow',
    body: 'Verified clock events feed payroll records so worked hours, uncalculated shifts, and pay windows stay connected.',
  },
];

function AboutPage() {
  return (
    <div className="about-page">
      <Navbar variant="public" />

      <main className="about-shell">
        <section className="about-hero">
          <div className="about-hero__copy">
            <span className="section-index">[ 00 ] - PUBLIC OVERVIEW</span>
            <h1 className="about-hero__title">
              AUTOMATED<br />
              <span className="display-title--chrome">PAYROLL SUPPORT.</span>
            </h1>
            <p className="about-hero__lede">
              ClockGuard is a biometric clock in and clock out platform built
              to make attendance, employee management, and payroll feel like
              one connected system.
            </p>
            <div className="about-hero__actions">
              <Link className="btn-primary" to="/login">
                Sign In
              </Link>
              <Link className="btn-outline" to="/settings">
                Settings
              </Link>
            </div>
          </div>

          <div className="about-hero__stage">
            <div className="about-admin-card about-admin-card--primary">
              <span className="section-index">WORKFLOW</span>
              <strong>Clock events to payroll</strong>
              <p>
                Verified shifts flow into attendance records and payroll review
                without duplicate data entry.
              </p>
            </div>
            <div className="about-admin-card">
              <span>Hours prepared</span>
              <strong>Auto calculated</strong>
            </div>
            <div className="about-admin-card">
              <span>Manager review</span>
              <strong>Clear exceptions</strong>
            </div>
            <div className="about-admin-card">
              <span>Employee status</span>
              <strong>Current roster</strong>
            </div>
          </div>
        </section>

        <section className="about-purpose">
          <div className="about-purpose__brand">
            <img src={clockGuardLogo} alt="" />
            <span>
              CLOCK<span className="display-title--chrome">GUARD</span>
            </span>
          </div>
          <p>
            The project is designed for teams that need reliable attendance
            records without slowing employees down at the start or end of a
            shift. A verified face match becomes the clock event, the clock
            event becomes an attendance record, and those records become the
            source for payroll and employee administration.
          </p>
        </section>

        <section className="about-feature-grid" aria-label="ClockGuard purpose">
          {featureCards.map((feature) => (
            <article className="about-feature-card" key={feature.title}>
              <span className="section-index">{feature.label}</span>
              <h2>{feature.title}</h2>
              <p>{feature.body}</p>
            </article>
          ))}
        </section>

        <section className="about-flow">
          <span className="section-index">[ 04 ] - OPERATING MODEL</span>
          <h2>
            FROM FACE MATCH<br />
            <span className="display-title--silver">TO PAYROLL.</span>
          </h2>
          <div className="about-flow__steps">
            <span>Verify employee</span>
            <span>Record clock event</span>
            <span>Review attendance</span>
            <span>Process payroll</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AboutPage;
