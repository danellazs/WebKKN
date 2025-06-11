import React, { useEffect, useState, useContext } from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";
import PointDisplay from "./pointDisplay";
import Gacha from "./gacha";
import scrollImage from "../assets/scroll.png";

type QuizChoice = {
  id: string;
  choice_text: string;
  is_correct: boolean;
};

type QuizQuestion = {
  id: string;
  question: string;
  choices: QuizChoice[];
};

interface ScrollQuizProps {
  isVisible: boolean;
  onClose: () => void;
}

const ScrollQuiz: React.FC<ScrollQuizProps> = ({ isVisible, onClose }) => {
  const session = useContext(SessionContext);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [points, setPoints] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch total poin user
  const fetchPoints = async () => {
    if (!session) return;

    const { data } = await supabase
      .from("points")
      .select("value")
      .eq("user_id", session.user.id);

    if (data) {
      const total = data.reduce((sum, row) => sum + row.value, 0);
      setPoints(total);
    }
  };

  // Fetch quiz saat mount
  useEffect(() => {
    if (isVisible) {
      fetchQuiz();
      setIsAnimating(true);
    }
  }, [isVisible]);

  // Fetch points tiap trigger berubah
  useEffect(() => {
    fetchPoints();
  }, [session, refreshTrigger]);

  const fetchQuiz = async () => {
    const { data: questionsData, error } = await supabase
      .rpc("get_random_quiz_questions", { count: 3 });

    if (error) {
      console.error("Fetch error:", error.message);
      return;
    }

    const withChoices = await Promise.all(
      questionsData.map(async (q: any) => {
        const { data: choices } = await supabase
          .from("quiz_choices")
          .select("*")
          .eq("question_id", q.id);

        return { ...q, choices };
      })
    );

    setQuestions(withChoices);
  };

  const handleSelect = (questionId: string, choiceId: string) => {
    setAnswers({ ...answers, [questionId]: choiceId });
  };

  const handleSubmit = async () => {
    if (!session) {
      alert("Tolong login terlebih dahulu sebelum mengirim jawaban.");
      return;
    }

    let correct = 0;

    for (const question of questions) {
      const selectedId = answers[question.id];
      const selectedChoice = question.choices.find(c => c.id === selectedId);
      if (selectedChoice?.is_correct) {
        correct += 1;
        await supabase.from("points").insert({
          user_id: session.user.id,
          value: 10,
          source: `Benar pada kuis: ${question.question}`
        });
      }
    }

    setScore(correct * 10);
    setSubmitted(true);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      // Reset state ketika tutup
      setSubmitted(false);
      setAnswers({});
      setScore(0);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="scroll-overlay">
      <div className={`scroll-container ${isAnimating ? 'animate-up' : ''}`}>
        {/* Background scroll image */}
        <div className="scroll-background">
          <img src={scrollImage} alt="Ancient Scroll" className="scroll-image" />
        </div>

        {/* Close button */}
        <button className="scroll-close-btn" onClick={handleClose}>
          ✕
        </button>

        {/* Quiz content */}
        <div className="scroll-content">
          <div className="scroll-header">
            <h2>📜 Kuis Pengetahuan Kuno 📜</h2>
          </div>

          <div className="quiz-questions">
            {questions.map((q, index) => (
              <div key={q.id} className="question-item">
                <p className="question-text">
                  <strong>{index + 1}. {q.question}</strong>
                </p>
                
                <div className="choices-container">
                  {q.choices.map(choice => (
                    <div key={choice.id} className="choice-item">
                      <label className="choice-label">
                        <input
                          type="radio"
                          name={q.id}
                          value={choice.id}
                          checked={answers[q.id] === choice.id}
                          onChange={() => handleSelect(q.id, choice.id)}
                          disabled={submitted}
                          className="choice-radio"
                        />
                        <span className="choice-text">{choice.choice_text}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="quiz-actions">
            {!submitted ? (
              <button className="submit-btn" onClick={handleSubmit}>
                🏺 Submit Jawaban
              </button>
            ) : (
              <div className="score-display">
                <p>🎉 Skor kamu: <strong>{score} poin</strong> 🎉</p>
              </div>
            )}
          </div>

          {/* Point Display and Gacha */}
          <div className="quiz-extras">
            <PointDisplay refreshTrigger={refreshTrigger} />
            <Gacha
              points={points}
              refreshPoints={() => setRefreshTrigger(prev => prev + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollQuiz;