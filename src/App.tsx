import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import Geolocation from './components/geolocation';
import { supabase } from "./supabase-client";
import { SessionContext } from "./context/sessionContext";
import LocalVerificationButton from "./components/localVerification";

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function fetchSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    }
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
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
      {session ? (
        <>
          <button onClick={logout}>Log Out</button>
          {/* Remove passing session as prop */}
          <Geolocation />
          <LocalVerificationButton />
        </>
      ) : (
        <Auth />
      )}
    </SessionContext.Provider>
  );
}

export default App;
