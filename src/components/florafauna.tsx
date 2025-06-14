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
        backgroundImage: "url('assets/sectionbg2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "4rem 1rem 1rem 1rem",
        aspectRatio: "1440 / 1900",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        zIndex: 20,
        width: "100%", 
        position: "relative",
      }}
    >
      {/* TITLE HEADER */}
      <h1
        style={{
          fontSize: "2rem",
          color: "#3D5072",
          fontFamily: "Bodar, sans-serif",
          textAlign: "center",
          margin: 0,
        }}
      >
        {type === "flora" ? "FLORA" : "FAUNA"}
      </h1>

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
        }}
        >
        {/* Left Arrow */}
        <div>
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

         <div
            style={{
            display: "flex",
            flexDirection: isReversed ? "row-reverse" : "row",
            alignItems: "center",
            gap: "1rem",
            flex: 1,
            }}
        >

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
                fontSize: "clamp(1.5rem, 2.5vw, 1.2rem)",
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
        </div>

        {/* Right Arrow */}
        <div>
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
            fontWeight: 400,
          }}
        >
          {floraFaunaItems[current].description}
        </p>
      </div>
    </div>
  );
};

export default FloraFauna;
