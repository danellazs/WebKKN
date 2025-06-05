import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import Geolocation from "./pages/geolocation";
import { supabase } from "./supabase-client";
import { SessionContext } from "./context/sessionContext";
import LocalVerificationButton from "./components/localVerification";
import QuizGame from './components/quizGame';



function App() {
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
    <SessionContext.Provider value={session}>
      <div className="app-wrapper">
        {session ? (
          <>
            <button onClick={logout}>Log Out</button>
          </>
        ) : (
          <>
            <button onClick={() => setShowAuth(true)}>Login / Sign Up</button>
          </>
        )}

        {/* Main app content always rendered */}
        <Geolocation />
        <LocalVerificationButton />
        <QuizGame />

        {/* Conditionally render Auth modal/form */}
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
      </div>
    </SessionContext.Provider>
  );
}

export default App;
