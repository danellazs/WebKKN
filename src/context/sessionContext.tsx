import React from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabase-client';
import type { Session } from '@supabase/supabase-js';
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";


// Create context that holds Session or null
export const SessionContext = createContext<Session | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};
