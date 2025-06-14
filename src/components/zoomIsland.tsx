import React, { useState, useRef } from "react";
import SlidingImage from "./slidingImage";

const ZoomIsland: React.FC = () => {
  const [zoomed, setZoomed] = useState(false);
  const [activeDescription, setActiveDescription] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    setZoomed(true);
  };

  // Custom zoom-out logic: only zoom out if click is outside hotspots
  const handleZoomedIslandClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains("hotspot")) {
      setZoomed(false);
      setActiveDescription(null);
    }
  };

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

        {/* Zoomed Island with clickable areas */}
        {zoomed && (
          <div
            onClickCapture={handleZoomedIslandClick}
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

            {/* Hotspot 1 */}
            <div
              className="hotspot"
              onClick={() => setActiveDescription(1)}
              style={{
                position: "absolute",
                top: "30%",
                left: "20%",
                width: "5vw",
                height: "5vw",
                cursor: "pointer",
                zIndex: 10,
                backgroundColor: "rgba(255, 0, 0, 0.3)",
                borderRadius: "50%",
              }}
            />

            {/* Hotspot 2 */}
            <div
              className="hotspot"
              onClick={() => setActiveDescription(2)}
              style={{
                position: "absolute",
                top: "50%",
                left: "60%",
                width: "5vw",
                height: "5vw",
                cursor: "pointer",
                zIndex: 10,
                backgroundColor: "rgba(0, 0, 255, 0.3)",
                borderRadius: "50%",
              }}
            />

            {/* Optional overlay banners */}
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

      {/* Description Area 1 */}
      {activeDescription === 1 && (
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
            backgroundColor: "white",
            borderRadius: "10px",
          }}
        >
          <strong>Description Area 1:</strong> Info about red hotspot — Lorem ipsum dolor sit amet.
        <SlidingImage />
        </div>
      )}

      {/* Description Area 2 */}
      {activeDescription === 2 && (
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
            zIndex: 15,
            backgroundColor: "white",
            borderRadius: "10px",
          }}
        >
          <strong>Description Area 2:</strong> Info about blue hotspot — Sed ut perspiciatis unde omnis iste.
          <SlidingImage />
        </div>
      )}
    </div>
  );
};

export default ZoomIsland;
