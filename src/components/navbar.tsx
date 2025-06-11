//C:\Users\user\Desktop\github\kkn\kknpaloh\src\components\navbar.tsx

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { Auth } from "./auth";

const Navbar = () => {
  // **STATE DAN FUNGSI UNTUK AUTH**
  const [session, setSession] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);

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
  };

  return (
    <nav>
      <div className="nav-container">
        <ul>
          <li><Link to="/testing">Testing yak</Link></li>
          <li><Link to="/geolocation">Geoloc</Link></li>
          <li><Link to="/game">Game</Link></li>
          <li style={{ marginLeft: "auto" }}>
            {session ? (
              <button onClick={logout}>Log Out</button>
            ) : (
              <button onClick={() => setShowAuth(true)}>Login / Sign Up</button>
            )}
          </li>
        </ul>

        
      </div>

      {/* **MODAL AUTH JUGA DIPINDAH KE SINI** */}
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
