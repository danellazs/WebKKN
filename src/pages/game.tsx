import { useState, useEffect, useContext } from "react";
import ScrollQuiz from "../components/quizScroll";
import botol1 from "../assets/botol1.png";
import botol2 from "../assets/botol2.png";
import botol3 from "../assets/botol3.png";
import Gacha from "../components/gacha";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";
import { Button } from "../components/ui/button";

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
    { id: string; top: number; left: number; image: string; rotation: number }[]
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

  const fetchBotols = async () => {
    if (!session) return;
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data, error } = await supabase
      .from("question_generations")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_opened", false)
      .gte("generated_at", threeDaysAgo.toISOString());

    if (error) {
      console.error("Gagal mengambil botol:", error.message);
      return;
    }

    // Convert fetched data into botolButtons state
    const newBotols = data.map((item: any) => ({
      id: item.id,
      ...getRandomPosition(),
      image: getRandomBotol(),
      rotation: getRandomRotation()
    }));

    setBotolButtons(newBotols);
  };

  useEffect(() => {
    fetchBotols();
  }, [session]);

  const handleGenerateQuiz = async () => {
    if (!session) return;

    // Cek apakah user sudah generate hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today

    const { data: existing, error: checkError } = await supabase
      .from("question_generations")
      .select("*")
      .eq("user_id", session.user.id)
      .gte("generated_at", today.toISOString());

    if (checkError) {
      console.error("Gagal mengecek generate hari ini:", checkError.message);
      return;
    }

    if (existing && existing.length > 0) {
      alert("Kamu sudah generate quiz hari ini! Coba lagi besok.");
      return;
    }

    // Insert new generation row
    const {error: insertError } = await supabase
      .from("question_generations")
      .insert({
        user_id: session.user.id
      })
      .select();

    if (insertError) {
      console.error("Gagal generate quiz:", insertError.message);
      return;
    }

    // Refresh bottles
    await fetchBotols();
  };

  const clearAllBotols = async () => {
    if (!session) return;

    // Option: set is_opened = true untuk semua botol user yang belum dibuka
    const { error } = await supabase
      .from("question_generations")
      .update({ is_opened: true })
      .eq("user_id", session.user.id)
      .eq("is_opened", false);

    if (error) {
      console.error("Gagal menghapus botol:", error.message);
      return;
    }

    // Refresh bottles
    await fetchBotols();
  };

  const openScrollQuiz = () => setScrollQuizVisible(true);
  const closeScrollQuiz = () => setScrollQuizVisible(false);

  return (

    <div className="game-container">
      <div className="geoloc-title">
        <h1>Siap Bermain?</h1>
        <div style={{
            fontFamily: "Lato, sans-serif", 
            padding: "0vw 2vw", 
            letterSpacing: "2px",
            fontStyle: "italic"}}>
            <div>Mulai petualanganmu di Borneo. Kumpulkan poin, temukan hewan langka, dan ciptakan kenangan.</div>
      </div>
      </div>

      {/* Komponen Gacha */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          position: "relative"
        }}
      >
        <Gacha points={points} refreshPoints={fetchPoints} />
      </div>

      {/* Tombol Generate Quiz */}
      <Button
        onClick={handleGenerateQuiz}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#f0c674",
          borderRadius: "15px",
          padding: "15px 25px",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          zIndex: 1000,
          width: "35vw", 
          maxWidth: "300px"   
        }}
      >
        Generate Daily Quiz
      </Button>

      {/* Tombol Clear */}
      <Button
        onClick={clearAllBotols}
        style={{
          position: "fixed",
          bottom: "30px",
          left: "30px",
          backgroundColor: "#ff6b6b",
          borderRadius: "15px",
          padding: "10px 20px",
          fontSize: "16px",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          zIndex: 1000,
          width: "35vw", 
          maxWidth: "300px" 

        }}
      >
        Hapus Semua Botol
      </Button>

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
