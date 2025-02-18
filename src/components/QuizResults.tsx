import React from 'react';
import { Trophy, Clock, RotateCcw, History } from 'lucide-react';
import type { QuizAttempt } from '../types';

interface QuizResultsProps {
  attempt: QuizAttempt;
  totalQuestions: number;
  onRetry: () => void;
  onViewHistory: () => void;
}

export function QuizResults({ attempt, totalQuestions, onRetry, onViewHistory }: QuizResultsProps) {
  const percentage = Math.round((attempt.score / totalQuestions) * 100);
  const minutes = Math.floor(attempt.timeSpent / 60);
  const seconds = attempt.timeSpent % 60;
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 text-center border-b border-gray-100">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-50 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
          <p className="text-gray-600">Great job! Here's how you performed:</p>
        </div>

        <div className="grid grid-cols-2 gap-6 p-8">
          <div className="p-6 bg-blue-50 rounded-xl text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600 mb-1">Score</p>
            <p className="text-3xl font-bold text-blue-600">{percentage}%</p>
            <p className="text-sm text-blue-600">({attempt.score}/{totalQuestions} correct)</p>
          </div>
          
          <div className="p-6 bg-purple-50 rounded-xl text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-gray-600 mb-1">Time Spent</p>
            <p className="text-3xl font-bold text-purple-600">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
            <p className="text-sm text-purple-600">minutes</p>
          </div>
        </div>

        <div className="p-8 pt-0 space-y-4">
          <button
            onClick={onRetry}
            className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={onViewHistory}
            className="w-full py-4 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <History className="w-5 h-5" />
            View History
          </button>
        </div>
      </div>
    </div>
  );
}