import React, { useEffect, useRef, useState } from "react";
import pasir from "../assets/pasir.png";
import ombak1 from "../assets/ombak1.png";
import ombak2 from "../assets/ombak2.png";
import ombak3 from "../assets/ombaktes.png";
import ZoomIsland from "./zoomIsland";
import ThreeImageSection from "./trisection"; 
import FloraFauna from "./florafauna";

const Hero: React.FC = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const lokasiRef = useRef<HTMLDivElement>(null);
  const floraRef = useRef<HTMLDivElement>(null);
  const faunaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 1000;
      setScrollOffset(Math.min(scrollY, maxScroll));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
const ombak1Move = Math.min(scrollOffset * 0.7, 170); // was 0.6, 150
const ombak2Move = Math.min(scrollOffset * 0.5, 120); // was 0.4, 100
const ombak3Move = Math.min(scrollOffset * 0.3, 100); // was 0.25, 80


  return (
    <section
      id="home"
      className="hero-section"
      style={{
        position: "relative",
        overflow: "visible",
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
          top: "clamp(90px, 12vw, 150px)",
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
          top: "clamp(120px, 15vw, 200px)",
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
          top: "clamp(400px, 80vw, 800px)",
          transform: `translateY(-${ombak3Move}px)`,
        }}
      />
      <div className="hero-content">
        <div className="hero-overlay" />
        <div className="hero-text">
          <h1>Menjejak Asa<br />di Ekor Borneo</h1>
        </div>
      </div>
      <ThreeImageSection
        onScroll={(section) => {
          if (section === "LOKASI") lokasiRef.current?.scrollIntoView({ behavior: "smooth" });
          else if (section === "FLORA") floraRef.current?.scrollIntoView({ behavior: "smooth" });
          else if (section === "FAUNA") faunaRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <div ref={lokasiRef}>
        <ZoomIsland />
      </div>

      <div ref={floraRef}>
        <FloraFauna type="flora" />
      </div>

      <div ref={faunaRef}>
        <FloraFauna type="fauna" />
      </div>
    </section>
  );
};

export default Hero;
