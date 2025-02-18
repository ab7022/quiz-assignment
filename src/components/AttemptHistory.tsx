import React from 'react';
import { History } from 'lucide-react';
import type { QuizAttempt } from '../types';

interface AttemptHistoryProps {
  attempts: QuizAttempt[];
  totalQuestions: number;
}

export function AttemptHistory({ attempts, totalQuestions }: AttemptHistoryProps) {
  const sortedAttempts = [...attempts].sort((a, b) => b.date - a.date);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Attempt History</h2>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedAttempts.map((attempt) => (
              <tr key={attempt.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(attempt.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {Math.round((attempt.score / totalQuestions) * 100)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {Math.floor(attempt.timeSpent / 60)}:{String(attempt.timeSpent % 60).padStart(2, '0')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}