import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="blood-home">

      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="nav-container">

          <Link to="/" className="brand">
            <div className="brand-drop">♥</div>
            <div>
              <div className="brand-name">
                Blood<span>Bank</span>
              </div>
              <div className="brand-tagline">
                Save Lives • Donate Blood
              </div>
            </div>
          </Link>

          <nav className="nav-menu">
            <Link className="active" to="/">Home</Link>
            <Link to="/Login">Hospitals</Link>
            <Link to="/Login">Donors</Link>
            <Link to="/Login"> Emergency Blood Requests</Link>
            <Link to="/Login">Reports</Link>
          </nav>

          <div className="nav-actions">
            <Link to="/Login" className="login-button">
              👤 Login
            </Link>

          </div>

        </div>
      </header>


      {/* ================= HERO ================= */}
      <section className="hero">

        <div className="hero-background-shape"></div>

        <div className="hero-container">

          <div className="hero-content">

            <h1>
              Your Blood Can
              <span>Save a Life</span>
            </h1>

            <p>
              Join our mission to save lives. Connect with donors,
              hospitals and patients in need of blood. Together we can
              make a difference.
            </p>

            <div className="hero-buttons">

              <Link to="/Login" className="primary-button">
                <span>◉</span>
                Become a Donor
              </Link>

              <Link to="/Login" className="outline-button">
                <span>♢</span>
                Request Blood
              </Link>

            </div>

          </div>


          {/* HERO IMAGE */}
          <div className="hero-visual">

            <div className="hero-photo">
              <div className="doctor-placeholder">

                <div className="doctor-head"></div>

                <div className="doctor-body">
                  <div className="stethoscope">♡</div>
                </div>

                <div className="blood-bag">
                  <div className="blood-bag-top"></div>
                  <div className="blood-level"></div>
                </div>

                <div className="heart">
                  ♥
                  <small>♥</small>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ================= STATISTICS ================= */}
      <section className="statistics">

        <div className="stat">
          <div className="stat-icon">♟</div>
          <div>
            <strong>1,250+</strong>
            <span>Registered Donors</span>
          </div>
        </div>

        <div className="stat-divider"></div>

        <div className="stat">
          <div className="stat-icon">▦</div>
          <div>
            <strong>45+</strong>
            <span>Hospitals</span>
          </div>
        </div>

        <div className="stat-divider"></div>

        <div className="stat">
          <div className="stat-icon">♦</div>
          <div>
            <strong>3,500+</strong>
            <span>Blood Donations</span>
          </div>
        </div>

        <div className="stat-divider"></div>

        <div className="stat">
          <div className="stat-icon">♥</div>
          <div>
            <strong>2,800+</strong>
            <span>Lives Saved</span>
          </div>
        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section">

        <div className="section-heading">
          <div className="section-label">HOW IT WORKS</div>

          <h2>Simple Steps to Save Lives</h2>

          <p>
            Our platform makes blood donation and emergency requests
            easy and organized.
          </p>
        </div>


        <div className="steps">

          <div className="step-card">

            <div className="step-icon">♟</div>

            <div>
              <h3>1. Sign In</h3>
              <p>
                Sign in to your account as a donor,
                hospital or admin.
              </p>
            </div>

          </div>


          <div className="arrow">→</div>


          <div className="step-card">

            <div className="step-icon">♦</div>

            <div>
              <h3>2. Find & Match</h3>
              <p>
                Find compatible donors or
                hospitals with available blood.
              </p>
            </div>

          </div>


          <div className="arrow">→</div>


          <div className="step-card">

            <div className="step-icon">♥</div>

            <div>
              <h3>3. Save Lives</h3>
              <p>
                Connect and donate blood to
                those in need.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ================= LOWER SECTIONS ================= */}
      <section className="lower-section">

        {/* WHY DONATE */}
        <div className="donate-card">

          <div className="donate-content">

            <div className="big-drop">♦</div>

            <div>
              <h2>Why Donate Blood?</h2>

              <ul>
                <li>✓ Saves lives</li>
                <li>✓ Helps patients in emergency situations</li>
                <li>✓ Builds a healthier community</li>
                <li>✓ You can make a real difference</li>
              </ul>

              <Link to="/" className="small-red-button">
                👤 Become a Donor Today →
              </Link>
            </div>

          </div>

          <div className="hand-icon">
            <div className="hand-drop">♥</div>
            <div className="hand-shape"></div>
          </div>

        </div>


        {/* EMERGENCY */}
        <div className="emergency-card">

          <div className="emergency-content">

            <div className="ambulance">✚</div>

            <div>
              <h2>Emergency Blood Request</h2>

              <p>
                Hospitals can quickly request blood for
                patients in critical condition.
              </p>

              <Link
                to="/blood-requests/create"
                className="emergency-button"
              >
                ♟ Submit Request →
              </Link>
            </div>

          </div>

          <div className="heartbeat">
            〰〰〰♥〰〰〰
          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="footer">

  <div className="footer-main">

    {/* BRAND */}
    <div className="footer-brand">

      <div className="footer-brand-logo">

        <div className="footer-logo-drop">
          ♥
        </div>

        <h2>
          Smart<span>BloodBank</span>
        </h2>

      </div>

      <p>
        Connecting blood donors, hospitals and patients
        to make blood donation easier, faster and more
        accessible for everyone.
      </p>

      <div className="footer-socials">
        <a href="#">f</a>
        <a href="#">𝕏</a>
        <a href="#">in</a>
        <a href="#">◎</a>
      </div>

    </div>


    {/* QUICK LINKS */}
    <div className="footer-column">

      <h3>Quick Links</h3>

      <Link to="/">Home</Link>
      <Link to="/donors">Donors</Link>
      <Link to="/hospitals">Hospitals</Link>
      <Link to="/emergency-requests">
        Blood Requests
      </Link>

    </div>


    {/* SERVICES */}
    <div className="footer-column">

      <h3>Services</h3>

      <Link to="/donors">
        Find Donors
      </Link>

      <Link to="/hospitals">
        Find Hospitals
      </Link>

      <Link to="/inventory">
        Blood Inventory
      </Link>

      <Link to="/emergency-requests">
        Emergency Requests
      </Link>

    </div>


    {/* CONTACT */}
    <div className="footer-column footer-contact">

      <h3>Contact Us</h3>

      <p>
        📍 Blood Bank Center
      </p>

      <p>
        ☎ +252 63 XXX XXXX
      </p>

      <p>
        ✉ info@smartbloodbank.com
      </p>

      <p>
        🕐 Available 24/7
      </p>

    </div>

  </div>

  {/* BOTTOM */}
  <div className="footer-bottom">

    <p>
      © 2026 <span>Smart BloodBank</span>.
      All rights reserved.
    </p>

    <p>
      Saving lives through blood donation ❤️
    </p>

  </div>

      </footer>

    </div>
  );
}