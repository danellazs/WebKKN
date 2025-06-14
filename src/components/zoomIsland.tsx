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
      <p
        style={{
          textAlign: "center",
          fontSize: "0.85rem",
          color: "#555",
          marginBottom: "1rem",
          marginTop: "1rem",
          zIndex: 10,
          position: "relative",
        }}
      >
        Anda bisa berinteraksi dengan map
      </p>

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
                left: "22%",
                width: "5vw",
                height: "5vw",
                cursor: "pointer",
                zIndex: 10,
                backgroundColor: "transparent",
                borderRadius: "50%",
              }}
            />

            {/* Hotspot 2 */}
            <div
              className="hotspot"
              onClick={() => setActiveDescription(2)}
              style={{
                position: "absolute",
                top: "18%",
                left: "27%",
                width: "5vw",
                height: "5vw",
                cursor: "pointer",
                zIndex: 10,
                backgroundColor: "transparent",
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
            marginTop: "5vw",
            padding: "0.5vw 0vw",
            fontSize: "1rem",
            lineHeight: "1.6",
            color: "#3D5072",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
            zIndex: 15,
            borderRadius: "0px",
          }}
        >
          
          <div style={{
            fontFamily: "Lato, sans-serif", 
            padding: "0vw 2vw", 
            letterSpacing: "2px",
            fontStyle: "italic"}}>
            <div>
              <strong>Mengenal Sebubus</strong> 
            </div>
          </div>

          <div style={{padding: "0vw 5vw 3vw 5vw",}}>
          <br />
          Infosebubus Lorem ipsum dolor sit amet, 
          consectetur adipiscing elit, sed do eiusmod tempor incididunt 
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum
          </div>
        <SlidingImage borderRadius="0px"/>
        </div>
      )}

      {/* Description Area 2 */}
      {activeDescription === 2 && (
        <div
          style={{
            position: "relative",
            marginTop: "5vw",
            padding: "0.5vw 0vw",
            fontSize: "1rem",
            lineHeight: "1.6",
            color: "#3D5072",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
            zIndex: 15,
          }}
        >
          <div style={{
            fontFamily: "Lato, sans-serif", 
            padding: "0vw 2vw", 
            letterSpacing: "2px",
            fontStyle: "italic"}}>
            <div>
              <strong>Mengenal Temajuk</strong> 
            </div>
          </div>

          <div style={{padding: "0vw 5vw 3vw 5vw"}}>
          <br />
          Info temajuk Lorem ipsum dolor sit amet, 
          consectetur adipiscing elit, sed do eiusmod tempor incididunt 
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum
          </div>
          <SlidingImage borderRadius="0px"/>
        </div>
      )}
    </div>
  );
};

export default ZoomIsland;
