import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { Auth } from "./auth";

const Navbar = () => {
  const [session, setSession] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // This is the toggle state

  // Toggle menu open/close
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Close menu when a link is clicked (optional)
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    async function fetchSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    }

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) setShowAuth(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    closeMenu(); // Optional: close menu on logout
  };

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-left">
          <div className="nav-logo">
            <Link to="/" onClick={closeMenu}>Saga Ekor Borneo</Link>
          </div>
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
        </div>

        <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <li>
            <Link to="/testing" onClick={closeMenu}>Testing yak</Link>
          </li>
          <li>
            <Link to="/geolocation" onClick={closeMenu}>Geoloc</Link>
          </li>
          <li>
            <Link to="/game" onClick={closeMenu}>Game</Link>
          </li>
          <li className="auth-button">
            {session ? (
              <button onClick={logout}>Log Out</button>
            ) : (
              <button onClick={() => { setShowAuth(true); closeMenu(); }}>
                Login / Sign Up
              </button>
            )}
          </li>
        </ul>
      </div>

      {showAuth && (
        <div className="auth-modal-overlay">
          <div className="auth-modal-content">
            <button
              onClick={() => setShowAuth(false)}
              className="auth-modal-close-button"
            >
              Close
            </button>
            <Auth />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
