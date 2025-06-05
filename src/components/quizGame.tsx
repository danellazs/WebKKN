import { useEffect, useState, useContext } from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";
import PointDisplay from "./pointDisplay";
import Gacha from "./gacha"; // ⬅️ pastikan kamu import ini

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

const QuizGame = () => {
  const session = useContext(SessionContext);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ✅ Tambah state untuk poin
  const [points, setPoints] = useState(0);

  // ✅ Fetch total poin user
  const fetchPoints = async () => {
    if (!session) return;

    const { data} = await supabase
      .from("points")
      .select("value")
      .eq("user_id", session.user.id);

    if (data) {
      const total = data.reduce((sum, row) => sum + row.value, 0);
      setPoints(total);
    }
  };

  // ✅ Fetch quiz saat mount
  useEffect(() => {
    fetchQuiz();
  }, []);

  // ✅ Fetch points tiap trigger berubah
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
    if (!session){alert("Tolong login terlebih dahulu sebelum mengirim jawaban.");
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

    // ✅ Trigger untuk refresh points dan child component
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div>
      <h2>Kuis Pengetahuan</h2>
      {questions.map((q, index) => (
        <div key={q.id} style={{ marginBottom: "1rem" }}>
          <p><strong>{index + 1}. {q.question}</strong></p>
          {q.choices.map(choice => (
            <div key={choice.id}>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  value={choice.id}
                  checked={answers[q.id] === choice.id}
                  onChange={() => handleSelect(q.id, choice.id)}
                  disabled={submitted}
                />
                {choice.choice_text}
              </label>
            </div>
          ))}
        </div>
      ))}

      {!submitted ? (
        <button onClick={handleSubmit}>Submit Jawaban</button>
      ) : (
        <p>Skor kamu: {score} poin</p>
      )}

      <PointDisplay refreshTrigger={refreshTrigger} />

      {/* ✅ Tambah Gacha dan passing state-nya */}
      <Gacha
        points={points}
        refreshPoints={() => setRefreshTrigger(prev => prev + 1)}
      />
    </div>
  );
};

export default QuizGame;
