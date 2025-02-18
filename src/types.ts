export interface Question {
  id: number;
  type: 'multiple-choice' | 'integer';
  question: string;
  options?: string[];
  correctAnswer: string | number;
}

export interface QuizAttempt {
  id: string;
  date: number;
  score: number;
  timeSpent: number;
  answers: Record<number, string | number>;
}