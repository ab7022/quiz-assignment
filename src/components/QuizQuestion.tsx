import React, { useState, useEffect } from 'react';
import type { Question } from '../types';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  userAnswer: string | number | null;
  onAnswer: (answer: string | number) => void;
  showFeedback?: boolean;
  questionNumber: number;
  totalQuestions: number;
  timeLeft: number;
  completeQuiz: ()=> void;
  onNextQuestion:  React.Dispatch<React.SetStateAction<number>>
}

export function QuizQuestion({ 
  question, 
  userAnswer, 
  onAnswer, 
  showFeedback,
  questionNumber,
  totalQuestions,
  timeLeft,
  completeQuiz,
  onNextQuestion
}: QuizQuestionProps) {
  const [inputValue, setInputValue] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = userAnswer !== null && userAnswer === question.correctAnswer;

  // Helper hints for different question types
  const hints = {
    'multiple-choice': 'Read each option carefully and eliminate obviously wrong answers first.',
    'integer': 'Take your time to calculate. You can use paper for complex calculations.'
  };

  useEffect(() => {
    setShowResult(false);
    setShowHint(false);
  }, [question.id]);


  const handleNextQuestion = () => {
    onAnswer(Number(inputValue));
    console.log(question.correctAnswer, userAnswer);
    
    if (!userAnswer) return;
    console.log(inputValue)
    onAnswer(Number(inputValue));
    setShowResult(true);
    
    setTimeout(() => {
      if (questionNumber < totalQuestions) {
        onNextQuestion(prev => prev + 1);
        setInputValue(0);
      }else{
        completeQuiz();
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                Question {questionNumber} of {totalQuestions}
              </span>
              <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                {question.type === 'multiple-choice' ? 'Multiple Choice' : 'Numerical Answer'}
              </span>
              {timeLeft <= 5 && (
                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium animate-pulse flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Time running out!
                </span>
              )}
            </div>
            {showResult && (
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <div className="flex items-center gap-1 text-green-600 animate-bounce">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Correct!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Incorrect</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{question.question}</h3>
          
          {/* Hint System */}
          <div className="relative">
            <button 
              onClick={() => setShowHint(!showHint)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <HelpCircle className="w-4 h-4" />
              Need a hint?
            </button>
            {showHint && (
              <div className="absolute top-full mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 shadow-lg max-w-md z-10">
                {hints[question.type]}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 bg-gray-50">
          {question.type === 'multiple-choice' ? (
            <div className="space-y-3">
              {question.options?.map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = userAnswer === letter;
                console.log(isSelected, letter, userAnswer);
                return (
                  <button
                    key={letter}
                    onClick={() => onAnswer(letter)} 

                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-xl transition-all duration-200 hover:scale-[1.01] ${
                      isSelected
                        ? showResult
                          ? isCorrect
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : 'bg-red-50 border-red-500 text-red-700'
                          : 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-300'
                    } border-2 ${
                      showResult && letter === question.correctAnswer
                        ? 'border-green-500'
                        : 'border-gray-200'
                    } shadow-sm`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 font-semibold">
                        {letter}
                      </span>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(Number(e.target.value));

                  }}
               
                 
                  disabled={showResult}
                  className="w-full p-4 border-2 rounded-xl focus:border-blue-500 outline-none text-lg"
                  placeholder="Enter your numerical answer..."
                />
           
              </div>
              {showResult && (
                <div className={`p-4 rounded-lg ${
                  isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {isCorrect ? 'Correct!' : `The correct answer is: ${question.correctAnswer}`}
                </div>
              )}
            </div>
          )}
        </div>

        <button 
          className={`w-full p-4 font-semibold rounded-b-2xl transition-all duration-200 flex items-center justify-center gap-2 ${
            'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={handleNextQuestion}
        >
          {showResult ? 'Moving to next question...' : 'Submit Answer'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
     
    </div>
  );
}