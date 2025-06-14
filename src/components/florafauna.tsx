import React, { useState } from "react";

const floraFaunaItems = [
  {
    img: "/assets/image4.jpg",
    title: "Gajah",
    description:
      "desc 1 avejhfbkhjafsgdhgjh Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  },
  {
    img: "/assets/image4.jpg",
    title: "Kelelawar",
    description:
      "desc 2 waefjydgukhwhurgej Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  },
  {
    img: "/assets/image4.jpg",
    title: "Unicorn",
    description:
      "desc 3 aefjduiufgyfkdgu Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  },
];

type FloraFaunaProps = {
  type?: "flora" | "fauna"; // default = flora
};

const FloraFauna: React.FC<FloraFaunaProps> = ({ type = "flora" }) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % floraFaunaItems.length);
  };

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? floraFaunaItems.length - 1 : prev - 1
    );
  };

  const isReversed = type === "fauna";

  return (
    <div
      style={{
        backgroundImage: "url('/assets/sectionbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "1rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        zIndex: 20,
        minHeight: "400px",
        position: "relative",
      }}
    >
      {/* Top cluster: arrows, image, and title */}
        <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            maxWidth: "1000px",
            width: "100%",
            height: "300px",
            position: "relative",
            justifyContent: "center",
            flexDirection: isReversed ? "row-reverse" : "row",
        }}
        >
        {/* Left Arrow */}
        <div style={{ padding: "0.25rem" }}>
            <button
            onClick={prev}
            style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                
            }}
            >
            <img 
                src="/assets/leftArrowtes.png" 
                alt="Left" width={20} 
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.7))" }} 
            />
            </button>
        </div>

        {/* Image */}
        <div
            style={{
            aspectRatio: "9 / 16",
            maxHeight: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
            flexShrink: 0,
            width: "160px", // fix agar gambar tidak terdorong
            }}
        >
            <img
            src={floraFaunaItems[current].img}
            alt={floraFaunaItems[current].title}
            style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
            />
        </div>

        {/* Title */}
        <div
            style={{
            flex: 1,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 0.5rem",
            }}
        >
            <h2
            style={{
                fontFamily: "Lato, sans-serif",
                fontSize: "clamp(2rem, 2.5vw, 1.5rem)",
                color: "#fff",
                textAlign: "center",
                textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                wordBreak: "break-word",
                maxWidth: "100%", // agar tidak mendorong gambar
            }}
            >
            {floraFaunaItems[current].title}
            </h2>
        </div>

        {/* Right Arrow */}
        <div style={{ padding: "0.25rem" }}>
            <button
            onClick={next}
            style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
            }}
            >
            <img 
                src="/assets/rightArrow.png" 
                alt="Right" width={20} 
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.7))" }} 
            />
            </button>
        </div>
        </div>


      {/* Description Below */}
      <div
        style={{
          maxWidth: "800px",
          textAlign: "center",
          padding: "0rem 1rem",
        }}
      >
        <p
          style={{
            fontFamily: "Lato, sans-serif",
            fontSize: "1rem",
            color: "#3D5072",
          }}
        >
          {floraFaunaItems[current].description}
        </p>
      </div>
    </div>
  );
};

export default FloraFauna;
