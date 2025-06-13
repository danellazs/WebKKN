import React, { useState, useRef, useEffect } from "react";

const ZoomIsland: React.FC = () => {
  const [zoomed, setZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    setZoomed(true);
  };

  // Detect outside clicks when zoomed
  useEffect(() => {
    if (!zoomed) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setZoomed(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [zoomed]);

  return (
    <div style={{ width: "100%", paddingTop: "5vw" }}>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* Base Island Image */}
        {!zoomed && (
          <img
            src="/assets/island.png"
            alt="Island"
            onClick={handleClick}
            style={{
              cursor: "pointer",
              zIndex: 1,
              width: "70vw",
              height: "auto",
              position: "relative",
            }}
          />
        )}

        {/* Zoomed Island and Banners */}
        {zoomed && (
          <div
            style={{
              position: "relative",
              width: "70vw",
              aspectRatio: "4 / 3",
            }}
          >
            <img
              src="/assets/islandzoom.png"
              alt="Zoomed Island"
              style={{
                position: "absolute",
                zIndex: 5,
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                objectFit: "contain",
              }}
            />
            <img
              src="/assets/sebubusbanner.png"
              alt="Sebubus"
              style={{
                position: "absolute",
                zIndex: 6,
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                objectFit: "contain",
              }}
            />
            <img
              src="/assets/temajukbanner.png"
              alt="Temajuk"
              style={{
                position: "absolute",
                zIndex: 6,
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                objectFit: "contain",
              }}
            />
          </div>
        )}
      </div>

      {/* Description 1 */}
      <div
        style={{
          position: "relative",
          marginTop: "6vw",
          padding: "2vw 4vw",
          fontSize: "1rem",
          lineHeight: "1.6",
          color: "red",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
          zIndex: 15,
        }}
      >
        <strong>Description Area 1:</strong> Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Praesent feugiat, lorem nec tincidunt
        facilisis, felis neque sagittis sapien, vitae vestibulum justo lacus at
        risus.
      </div>

      {/* Description 2 */}
      <div
        style={{
          position: "relative",
          marginTop: "3vw",
          padding: "2vw 4vw",
          fontSize: "1rem",
          lineHeight: "1.6",
          color: "#333",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
          zIndex: 10,
        }}
      >
        <strong>Description Area 2:</strong> Sed ut perspiciatis unde omnis iste
        natus error sit voluptatem accusantium doloremque laudantium, totam rem
        aperiam.
      </div>
    </div>
  );
};

export default ZoomIsland;
