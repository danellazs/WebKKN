import React from "react";
import pasir from "../assets/pasir.png";
import ombak1 from "../assets/ombak1.png";

const Hero: React.FC = () => {
  return (
    <section id="home" className="hero-section">
      <img src={pasir} alt="Pantai Temajuk" className="hero-image" />
      <img src={ombak1} alt="Ombak" className="ombak-image" />
      <div className="hero-overlay" />
      <div className="hero-text" style={{ fontFamily: "BODAR" }}>
        <h1>
          Menjejak Asa
          <br />
          di Ekor Borneo
        </h1>
      </div>
    </section>
  );
};

export default Hero;
