import React, { useState, useEffect } from "react";

const ThreeImageSection: React.FC = () => {
  const items = [
    {
      title: "LOKASI",
      img: "/assets/lokasi2.jpeg",
    },
    {
      title: "FLORA",
      img: "/assets/flora.jpeg",
    },
    {
      title: "FAUNA",
      img: "/assets/fauna.jpeg",
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile(); // initial
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        width: "100vw",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        flexWrap: isMobile ? "nowrap" : "wrap",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "1rem",
        boxSizing: "border-box",
        overflowX: "hidden",
        paddingTop: "50%", 
        
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            flex: isMobile ? "1 1 100%" : "1 1 30%",
            maxWidth: isMobile ? "100%" : "calc(33.33% - 1rem)",
            minWidth: "130px",
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            alignItems: isMobile ? "flex-start" : "center",
            background: "transparent",
            borderRadius: "8px",
            overflow: "hidden",
            boxSizing: "border-box",
            fontFamily: "Lato, sans-serif",
            letterSpacing: "2px",
            gap: isMobile ? "1rem" : "0",
          }}
        >
          {/* Image section */}
          <div
            style={{
              width: isMobile ? "40%" : "100%",
              aspectRatio: isMobile ? "4/3" : "4/3",
              overflow: "hidden",
              borderRadius: "8px",
              flexShrink: 0,
            }}
          >
            <img
              src={item.img}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Text + Button section */}
          <div
            style={{
              flex: 1,
              padding: isMobile ? "0.5rem 0" : "0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: isMobile ? "flex-start" : "center",
            }}
          >
            <h3 style={{ margin: "1rem 0 0.5rem" }}>{item.title}</h3>
            <button
              style={{
                marginTop: "0.3rem",
                padding: "0.3rem 0.7rem",
                border: "1px solid #3D5072",
                backgroundColor: "transparent",
                color: "#3D5072",
                borderRadius: "50px",
                cursor: "pointer",
                fontFamily: "Lato, sans-serif",
                fontSize: "0.7rem",
                fontWeight: 200,
              }}
            >
              Lihat Selengkapnya
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreeImageSection;
