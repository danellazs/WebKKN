"use client";

import React from "react";
import pantaiTemajuk from "../assets/pantai-temajuk.jpg";

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="hero-section"
      style={{ backgroundImage: `url(${pantaiTemajuk})` }}
    >
      <div className="hero-overlay">
        <div className="hero-text">
          <h1 style={{ fontFamily: "BODAR" }}>
            Menjejak Asa
            <br />
            di Ekor Borneo
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;
