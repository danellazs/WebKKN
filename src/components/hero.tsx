import React, { useEffect, useRef, useState } from "react";
import pasir from "../assets/pasir.png";
import ombak1 from "../assets/ombak1.png";
import ombak2 from "../assets/ombak2.png";
import ombak3 from "../assets/ombaktes.png";

const Hero: React.FC = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 1000;
      setScrollOffset(Math.min(scrollY, maxScroll));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ombak1Move = Math.min(scrollOffset * 0.3, 60);
  const ombak2Move = Math.min(scrollOffset * 0.2, 50);  
  const ombak3Move = Math.min(scrollOffset * 0.1, 30);  


  return (
    <section
      id="home"
      className="hero-section"
      style={{
        position: "relative",
        overflow: "visible",
        aspectRatio: "638 / 1000",
        width: "100%",
      }}
    >
      <img
        ref={imageRef}
        src={pasir}
        alt="Pantai Temajuk"
        className="hero-image"
        style={{
          width: "100%",
          height: "auto",
          position: "absolute",
          zIndex: 0,
        }}
      />

      <img
        src={ombak1}
        alt="Ombak 1"
        style={{
          zIndex: 1,
          position: "absolute",
          width: "100%",
          top: "clamp(30px, 7vw, 50px)",
          left: "0",
          right: "0",
          transform: `translateY(-${ombak1Move + 100}px)`,
        }}
      />

      <img
        src={ombak2}
        alt="Ombak 2"
        style={{
          zIndex: 2,
          position: "absolute",
          width: "100%",
          top: "clamp(60px, 9vw, 80px)",
          left: "0",
          right: "0", 
          transform: `translateY(-${ombak2Move + 140}px)`,
        }}
      />

      <img
        src={ombak3}
        alt="Ombak 3"
        style={{
          zIndex: 3,
          position: "absolute",
          width: "100%",
          left: "0",
          right: "0", 
          top: "clamp(300px, 70vw, 7000px)",
          transform: `translateY(-${ombak3Move}px)`,
        }}
      />

      <div className="hero-overlay" />
      <div className="hero-text">
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
