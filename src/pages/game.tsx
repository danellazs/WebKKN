// src/pages/Game.tsx (atau sesuai lokasi file kamu)
import { useState, useEffect, useContext } from "react";
import ScrollQuiz from "../components/quizScroll";
import botol1 from "../assets/botol1.png";
import botol2 from "../assets/botol2.png";
import botol3 from "../assets/botol3.png";
import Gacha from "../components/gacha";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";

const getRandomPosition = () => ({
  top: Math.floor(Math.random() * 80) + 10,
  left: Math.floor(Math.random() * 80) + 10
});

const getRandomBotol = () => {
  const botols = [botol1, botol2, botol3];
  return botols[Math.floor(Math.random() * botols.length)];
};

const getRandomRotation = () => Math.floor(Math.random() * 360);

const Game = () => {
  const [scrollQuizVisible, setScrollQuizVisible] = useState(false);
  const [botolButtons, setBotolButtons] = useState<
    { id: number; top: number; left: number; image: string; rotation: number }[]
  >([]);

  const session = useContext(SessionContext);
  const [points, setPoints] = useState(0);

  const fetchPoints = async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from("points")
      .select("value")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Gagal mengambil points:", error.message);
      return;
    }

    const total = data.reduce((acc, item) => acc + item.value, 0);
    setPoints(total);
  };

  useEffect(() => {
    fetchPoints();
  }, [session]);

  const handleGenerateQuiz = () => {
    const newId = Date.now(); // unique id
    const newBotol = {
      id: newId,
      ...getRandomPosition(),
      image: getRandomBotol(),
      rotation: getRandomRotation()
    };
    setBotolButtons((prev) => [...prev, newBotol]);
  };

  const clearAllBotols = () => {
    setBotolButtons([]);
    localStorage.removeItem("botolButtons");
  };

  const openScrollQuiz = () => setScrollQuizVisible(true);
  const closeScrollQuiz = () => setScrollQuizVisible(false);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Komponen Gacha */}
      <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        position: "relative"
      }}
    >
      <Gacha points={points} refreshPoints={fetchPoints} />
      
      
    </div>
      {/* Tombol Generate Quiz */}
      <button
        onClick={handleGenerateQuiz}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#f0c674",
          border: "2px solid #8b4513",
          borderRadius: "15px",
          padding: "15px 25px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          zIndex: 1000
        }}
      >
        Generate Daily Quiz
      </button>

      {/* Tombol Clear */}
      <button
        onClick={clearAllBotols}
        style={{
          position: "fixed",
          bottom: "30px",
          left: "30px",
          backgroundColor: "#ff6b6b",
          border: "2px solid #8b0000",
          borderRadius: "15px",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: "bold",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          zIndex: 1000
        }}
      >
        Hapus Semua Botol
      </button>

      {/* Tampilkan Botol */}
      {botolButtons.map((botol) => (
        <img
          key={botol.id}
          src={botol.image}
          alt="Botol Quiz"
          onClick={openScrollQuiz}
          style={{
            position: "absolute",
            top: `${botol.top}%`,
            left: `${botol.left}%`,
            transform: `translate(-50%, -50%) rotate(${botol.rotation}deg)`,
            width: "60px",
            height: "auto",
            cursor: "pointer",
            zIndex: 999
          }}
        />
      ))}

      <ScrollQuiz isVisible={scrollQuizVisible} onClose={closeScrollQuiz} />
    </div>
  );
};

export default Game;
