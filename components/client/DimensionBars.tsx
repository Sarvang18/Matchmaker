'use client';

import { useEffect, useState } from 'react';

interface DimensionScore {
  name: string;
  weight: number;
  score: number;
  contribution: number;
}

interface DimensionBarsProps {
  dimensions?: DimensionScore[];
  scores?: Record<string, number>;
  compact?: boolean;
}

export function DimensionBars({ dimensions, scores, compact = false }: DimensionBarsProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Convert scores object to dimensions array if needed
  let dimensionsArray: DimensionScore[] = [];
  
  if (dimensions) {
    // Already in correct format
    dimensionsArray = dimensions;
  } else if (scores) {
    // Check if scores is already an array of dimension objects
    if (Array.isArray(scores)) {
      dimensionsArray = scores;
    } else {
      // Convert object format {Education: 70, Income: 80} to array
      dimensionsArray = Object.entries(scores).map(([name, score]) => ({
        name,
        score: typeof score === 'number' ? score / 100 : 0,
        weight: 0,
        contribution: 0,
      }));
    }
  }

  const barHeight = compact ? 'h-1' : 'h-1.5';
  const textSize = compact ? 'text-[10px]' : 'text-xs';
  const spacing = compact ? 'space-y-1.5' : 'space-y-2';

  return (
    <div className={spacing}>
      {dimensionsArray.map((dim, index) => {
        const scorePercent = dim.score >= 0 && dim.score <= 1 ? dim.score * 100 : dim.score;
        return (
          <div key={index} className="flex items-center gap-2">
            <span className={`${textSize} font-medium text-gray-600 w-16 truncate`}>{dim.name}</span>
            <div className={`flex-1 ${barHeight} bg-gray-200 rounded-full overflow-hidden`}>
              <div
                className={`h-full bg-gradient-to-r from-red-500 to-pink-600 rounded-full transition-all duration-600 ease-out`}
                style={{
                  width: animated ? `${scorePercent}%` : '0%',
                  transitionDelay: `${index * 50}ms`,
                }}
              />
            </div>
            <span className={`${textSize} font-semibold text-gray-900 w-8 text-right`}>
              {scorePercent.toFixed(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
