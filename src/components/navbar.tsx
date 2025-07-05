import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import UserInfoDisplay from "./userInfoDisplay";
import { Auth } from "./auth";

const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const Navbar = () => {
  const [session, setSession] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); 

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
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
    closeMenu();
  };

  const handleTouchLink = (path: string) => {
    setTimeout(() => {
      navigate(path);
      closeMenu();
    }, 300); 
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
            {isTouchDevice() ? (
              <button
                className="nav-touch-link"
                onTouchStart={() => handleTouchLink('/geolocation')}
              >
                Geoloc
              </button>
            ) : (
              <Link to="/geolocation" onClick={closeMenu}>Geoloc</Link>
            )}
          </li>
          <li>
            {isTouchDevice() ? (
              <button
                className="nav-touch-link"
                onTouchStart={() => handleTouchLink('/game')}
              >
                Game
              </button>
            ) : (
              <Link to="/game" onClick={closeMenu}>Game</Link>
            )}
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
          <UserInfoDisplay />
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
