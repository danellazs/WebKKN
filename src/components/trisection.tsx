import React from "react";

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

  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        width: "100vw",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "1rem",
        boxSizing: "border-box",
        overflowX: "hidden"
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            flex: "1 1 30%",
            maxWidth: "calc(33.33% - 1rem)",
            minWidth: "130px", // allows responsive shrink
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "transparent",
            borderRadius: "8px",
            overflow: "hidden",
            boxSizing: "border-box",
            fontFamily: "Bodar, sans-serif",
            letterSpacing: "3px",     
            fontWeight: 700,  
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "4 / 3",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <img
              src={item.img}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // crop, not stretch
                display: "block",
              }}
            />
          </div>
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
              fontFamily: "Segoe UI, sans-serif",
              fontSize: "0.8rem",
            }}
          >
            Lihat Selengkapnya
          </button>
        </div>
      ))}
    </div>
  );
};

export default ThreeImageSection;
