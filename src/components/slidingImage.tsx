import React, { useState } from "react";

const images = [
  "assets/image.png",
  "assets/image2.png",
  "assets/image3.jpeg",
];

type SlidingImageProps = {
  borderRadius?: string;
  width?: string; // e.g., "100vw", "600px", "80%"
};

const SlidingImage: React.FC<SlidingImageProps> = ({
  borderRadius = "10px",
  width = "100vw", // default
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      style={{
        position: "relative",
        width: width,
        aspectRatio: "16 / 9", // maintain 16:9 ratio
        margin: "auto",
        overflow: "hidden",
        borderRadius,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(-${currentSlide * (100 / images.length)}%)`,
          width: `${images.length * 100}%`,
          height: "100%",
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            style={{
              width: `${100 / images.length}%`,
              height: "100%",
              flexShrink: 0,
            }}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "0px",
              }}
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={goToPrev}
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
        }}
      >
        <img
          src="/assets/leftArrowtes.png"
          alt="Left"
          style={{ width: "30px", height: "30px" }}
        />
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
        }}
      >
        <img
          src="/assets/rightArrow.png"
          alt="Right"
          style={{ width: "30px", height: "30px" }}
        />
      </button>
    </div>
  );
};

export default SlidingImage;
