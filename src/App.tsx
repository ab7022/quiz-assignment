import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle } from 'lucide-react';
import { questions } from './data/questions';
import { Timer } from './components/Timer';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { AttemptHistory } from './components/AttemptHistory';
import { saveAttempt, getAttempts } from './utils/db';
import type { QuizAttempt } from './types';

const SECONDS_PER_QUESTION = 30;
const TOTAL_TIME = questions.length * SECONDS_PER_QUESTION;

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [showingHistory, setShowingHistory] = useState(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  useEffect(() => {
    loadAttempts();
  }, []);

  useEffect(() => {
    setQuestionTimeLeft(SECONDS_PER_QUESTION);
    setShowTimeWarning(false);
  }, [currentQuestion]);

  useEffect(() => {
    if (questionTimeLeft === 5) {
      setShowTimeWarning(true);
    }
  }, [questionTimeLeft]);

  async function loadAttempts() {
    const loadedAttempts = await getAttempts();
    setAttempts(loadedAttempts);
  }

  function handleAnswer(answer: string | number) {
    if (!answers[currentQuestion]) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
      
      const question = questions[currentQuestion];
      if (question.type === 'multiple-choice' && currentQuestion < questions.length - 1) {
        // setTimeout(() => {
        //   setCurrentQuestion(prev => prev + 1);
        // }, 1000);
      }
    }
  }

  function handleQuestionTimeout() {
    if (currentQuestion < questions.length - 1) {
      // Show a warning toast
      const warningToast = document.createElement('div');
      warningToast.className = 'fixed top-4 right-4 bg-yellow-50 border-2 border-yellow-500 text-yellow-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in';
      warningToast.innerHTML = `
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        Time's up! Moving to next question...
      `;
      document.body.appendChild(warningToast);
      setTimeout(() => warningToast.remove(), 3000);

      // Move to next question after a brief delay
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 1500);
    } else {
      completeQuiz();
    }
  }

  async function completeQuiz() {
    console.log(attempts);
    const score = questions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      date: Date.now(),
      score,
      timeSpent: TOTAL_TIME - timeSpent,
      answers
    };

    await saveAttempt(attempt);
    await loadAttempts();
    setQuizComplete(true);
  }

  function startNewQuiz() {
    setCurrentQuestion(0);
    setAnswers({});
    setTimeSpent(0);
    setQuizComplete(false);
    setShowingHistory(false);
    setQuestionTimeLeft(SECONDS_PER_QUESTION);
    setShowTimeWarning(false);
  }

  if (showingHistory) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowingHistory(false)}
            className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center gap-2"
          >
            <Brain className="w-5 h-5" />
            Back to Quiz
          </button>
          <AttemptHistory attempts={attempts} totalQuestions={questions.length} />
        </div>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <QuizResults
          attempt={attempts[attempts.length - 1]}
          totalScore = {totalScore}
          totalQuestions={questions.length}
          onRetry={startNewQuiz}
          onViewHistory={() => setShowingHistory(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Interactive Quiz</h1>
          </div>
          <Timer 
            key={currentQuestion} // Force timer remount for each question
            duration={SECONDS_PER_QUESTION} 
            onTimeUp={handleQuestionTimeout}
            onTick={setQuestionTimeLeft}
          />
        </div>

        <div className="w-full bg-white rounded-xl p-4 shadow-md">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <QuizQuestion
          question={questions[currentQuestion]}
          userAnswer={answers[currentQuestion] || null}
          onAnswer={handleAnswer}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          timeLeft={questionTimeLeft}
          onNextQuestion={setCurrentQuestion}
          completeQuiz={completeQuiz}
          score={totalScore}
          setScore={setTotalScore}
        />

        {showTimeWarning && (
          <div className="fixed bottom-4 right-4 bg-yellow-50 border-2 border-yellow-500 text-yellow-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
            <AlertTriangle className="w-5 h-5" />
            <span>5 seconds remaining!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;