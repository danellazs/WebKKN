import { useEffect, useState, useRef } from "react";

const MovingPet = ({ gif }: { gif: string }) => {
  const [pos, setPos] = useState({
    x: Math.random() * 400,
    y: Math.random() * 200,
  });

  const [facingLeft, setFacingLeft] = useState(false);
  const directionRef = useRef({
    dx: Math.random() * 2 - 1,
    dy: Math.random() * 2 - 1,
  });

  useEffect(() => {
    const move = () => {
      setPos((prev) => {
        let { x, y } = prev;
        let { dx, dy } = directionRef.current;

        x += dx * 2;
        y += dy * 2;

        // Pantulkan jika mengenai batas
        if (x < 0 || x > 450) directionRef.current.dx *= -1;
        if (y < 0 || y > 250) directionRef.current.dy *= -1;

        // Update arah menghadap
        setFacingLeft(dx < 0);

        // Batasi agar tetap dalam batas
        return {
          x: Math.max(0, Math.min(x, 450)),
          y: Math.max(0, Math.min(y, 250)),
        };
      });
    };

    const interval = setInterval(move, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={gif}
      alt="pet"
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: 50,
        height: 50,
        cursor: "pointer",
        transform: `
        scaleX(${facingLeft ? 1 : -1}) 
        scale(${1 + Math.sin(pos.x / 20) * 0.05}, ${1 + Math.cos(pos.y / 20) * 0.05})
      `,
        transition: "transform 0.2s ease-in-out",
        willChange: "transform",
      }}
    />
  );
};

export default MovingPet;
