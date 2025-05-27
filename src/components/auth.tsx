import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

import { supabase } from "../supabase-client";

export const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSignUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error("Error signing up:", signUpError.message);
        setErrorMessage(signUpError.message);
        return;
      }

      // Dapatkan user ID dari session
      const user = data.user;
      if (!user) {
        setErrorMessage("Sign up berhasil tapi user tidak ditemukan.");
        return;
      }

      // Masukkan data ke tabel users
      const { error: insertError } = await supabase.from("users").insert({
        id: user.id, 
        email,
        name,
        isLocal: null, // bisa dihilangkan karena default null
      });

      if (insertError) {
        console.error("Error inserting user data:", insertError.message);
        setErrorMessage(insertError.message);
        return;
      }

      setErrorMessage(null);
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Error signing in:", signInError.message);
        setErrorMessage(signInError.message);
        return;
      }

      setErrorMessage(null);
    }
  };


  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>

      {errorMessage && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        {isSignUp && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
          />
        )}
        <button
          type="submit"
          style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setErrorMessage(null);
        }}
        style={{ padding: "0.5rem 1rem" }}
      >
        {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
      </button>
    </div>
  );
};
