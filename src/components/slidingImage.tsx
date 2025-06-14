import React, { useState } from "react";

const images = [
  "assets/image.png",
  "assets/image2.png",
  "assets/image3.jpeg",
];

const SlidingImage: React.FC = () => {
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
        width: "400px", // responsive width
        height: "225px", // fixed height for cropping
        margin: "auto",
        overflow: "hidden",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(-${currentSlide * 400}px)`, // shift by px instead of %
          width: `${images.length * 400}px`, // fixed total width
          height: "100%",
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            style={{
              width: "400px",
              height: "225px",
              flexShrink: 0,
            }}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // or "contain" if no cropping wanted
                borderRadius: "10px",
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
          padding: "0",
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
          padding: "0",
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
