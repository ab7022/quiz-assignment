import React, { useEffect, useState, useCallback } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  onTick?: (timeLeft: number) => void;
  key?: string | number; // Add key prop to force remount
}

export function Timer({ duration, onTimeUp, onTick }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progress = (timeLeft / duration) * 100;

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        onTick?.(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onTimeUp, onTick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative flex items-center gap-2 p-4 bg-white rounded-xl shadow-md">
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div
          className="h-full bg-blue-50 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <TimerIcon className="w-5 h-5 text-blue-600 relative z-10" />
      <span className="text-lg font-semibold relative z-10">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}