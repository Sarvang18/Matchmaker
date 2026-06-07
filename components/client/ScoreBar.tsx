'use client';

import { useEffect, useState } from 'react';

interface ScoreBarProps {
  score: number;
  label?: string;
  showLabel?: boolean;
}

export function ScoreBar({ score, label, showLabel = true }: ScoreBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = () => {
    if (score >= 85) return 'bg-gradient-to-r from-yellow-500 to-amber-500';
    if (score >= 70) return 'bg-gradient-to-r from-red-500 to-pink-600';
    if (score >= 50) return 'bg-gradient-to-r from-teal-500 to-cyan-500';
    return 'bg-gray-400';
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-700 ease-out rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex items-center justify-between mt-1.5">
          {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
          <span className="text-sm font-bold text-gray-900">{score.toFixed(1)} / 100</span>
        </div>
      )}
    </div>
  );
}
