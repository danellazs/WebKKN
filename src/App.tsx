//C:\Users\user\Desktop\github\kkn\kknpaloh\src\App.tsx

import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import { supabase } from "./supabase-client";
import { SessionContext } from "./context/sessionContext";
import Geolocation from "./pages/geolocation";
import Testing from "./pages/testing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/game";

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

  return (
    <BrowserRouter>
      <SessionContext.Provider value={session}>
        <div className="nav-container">
          <Navbar />
          <div className="page-content">
          <Routes>
            <Route path="/geolocation" element={<Geolocation />} />
            <Route path="/testing" element={<Testing />} />
            <Route path="/game" element={<Game />} />
          </Routes>
          </div>
        </div>
      </SessionContext.Provider>
    </BrowserRouter>
  );
}

export default App;
