import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

const linkStyle = {
  color: "var(--text-primary)",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "16px",
  transition: "color 0.3s ease"
};

const profileLinkStyle = {
  ...linkStyle,
  color: "var(--accent-primary)",
  fontWeight: "bold"
};

const logoStyle = {
  fontSize: "20px",
  fontWeight: "900",
  letterSpacing: "2px",
  textDecoration: "none"
};

function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <nav className="custom-glass-nav">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" style={logoStyle}>
            <span style={{ color: "var(--accent-primary)" }}>Gold</span>
            <span style={{ color: "white" }}>fit</span>
          </Link>

          {/* Menu for Desktop */}
          <ul className="nav-menu">
            <li>
              <Link to="/" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Home</Link>
            </li>

            {user?.role === 'admin' && (
              <>
                <li>
                  <Link to="/dashboard" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/admin/management" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Management</Link>
                </li>
              </>
            )}

            {(user?.role === 'trainer' || user?.role === 'nutritionist') && (
              <li>
                <Link to="/specialist/dashboard" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Specialist Dashboard</Link>
              </li>
            )}

            <li>
              <Link to="/trainers" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Trainers</Link>
            </li>

            <li>
              <Link to="/machines" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Machines</Link>
            </li>

            <li>
              <Link to="/nutritionists" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Nutrition</Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link to="/exercises" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Exercises</Link>
                </li>
                <li>
                  <Link to="/meals" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Meals</Link>
                </li>
                {user && user.role === 'user' && (
                  <>
                    <li>
                      <Link to="/sessions" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Sessions</Link>
                    </li>
                    <li>
                      <Link to="/my-sessions" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>My Sessions</Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="/subscriptions" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Packages</Link>
                </li>
                <li>
                  <Link to="/ai-plans" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>AI Plans</Link>
                </li>
                <li>
                  <Link to="/wallet" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Wallet</Link>
                </li>
                <li>
                  <Link to="/profile" style={profileLinkStyle}>Profile</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>Login</Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    style={{
                      ...linkStyle,
                      background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                      color: "black",
                      fontWeight: "bold",
                      padding: "6px 20px",
                      borderRadius: "20px"
                    }}
                  >
                    Join
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Hamburger toggle button */}
          <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer Overlay */}
      {isOpen && (
        <div className="nav-mobile-overlay">
          <Link to="/" className="nav-mobile-link">Home</Link>
          
          {user?.role === 'admin' && (
            <>
              <Link to="/dashboard" className="nav-mobile-link">Dashboard</Link>
              <Link to="/admin/management" className="nav-mobile-link">Management</Link>
            </>
          )}

          {(user?.role === 'trainer' || user?.role === 'nutritionist') && (
            <Link to="/specialist/dashboard" className="nav-mobile-link">Specialist Dashboard</Link>
          )}

          <Link to="/trainers" className="nav-mobile-link">Coaches</Link>
          <Link to="/machines" className="nav-mobile-link">Equipment Arsenal</Link>
          <Link to="/nutritionists" className="nav-mobile-link">Nutritionists</Link>

          {user ? (
            <>
              <Link to="/exercises" className="nav-mobile-link">Exercise Library</Link>
              <Link to="/meals" className="nav-mobile-link">Nutrition Catalog</Link>
              {user.role === 'user' && (
                <>
                  <Link to="/sessions" className="nav-mobile-link">Sessions</Link>
                  <Link to="/my-sessions" className="nav-mobile-link">My Sessions</Link>
                </>
              )}
              <Link to="/subscriptions" className="nav-mobile-link">Packages</Link>
              <Link to="/ai-plans" className="nav-mobile-link">AI Plans</Link>
              <Link to="/wallet" className="nav-mobile-link">Wallet</Link>
              <Link to="/profile" className="nav-mobile-link" style={{ color: "var(--accent-primary)", fontWeight: "bold" }}>Profile</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-mobile-link">Login</Link>
              <Link
                to="/register"
                className="nav-mobile-link"
                style={{
                  background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                  color: "black",
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                Join Goldfit
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
