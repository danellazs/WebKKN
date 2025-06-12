// src/pages/testing.tsx
import { useState } from 'react';
import ScrollQuiz from "../components/quizScroll";


const Game = () => {

  const [showScrollQuiz, setShowScrollQuiz] = useState(false);

  const openScrollQuiz = () => {
    setShowScrollQuiz(true);
  };

  const closeScrollQuiz = () => {
    setShowScrollQuiz(false);
  };
  return (
    <div>
      <button 
          onClick={openScrollQuiz}
          className="open-scroll-btn"
          style={{
            background: 'linear-gradient(145deg, #d4a574, #b8956a)',
            color: '#2c1810',
            border: '2px solid #8b4513',
            borderRadius: '25px',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          📜 Buka Kuis Kuno
        </button>
      <ScrollQuiz 
        isVisible={showScrollQuiz} 
        onClose={closeScrollQuiz} 
      />
    </div>
  );
};

export default Game;
