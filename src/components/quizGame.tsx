import { useEffect, useState, useContext } from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";
import PointDisplay from "./pointDisplay";

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

  

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    const { data: questionsData, error } = await supabase
      .rpc('get_random_quiz_questions', { count: 3 });

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
    if (!session) return;

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

      {/* Highlight 3: Render PointsDisplay dengan prop refreshTrigger */}
      <PointDisplay refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default QuizGame;
