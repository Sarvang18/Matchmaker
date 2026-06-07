'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface Step {
  message: string;
  duration: number;
}

const steps: Step[] = [
  { message: 'Filtering compatibility pool...', duration: 500 },
  { message: 'Scoring 100+ profiles...', duration: 1000 },
  { message: 'Asking AI to review top matches...', duration: 3000 },
  { message: 'Almost ready...', duration: 500 },
];

export function MatchLoadingSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, steps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="space-y-4 py-8">
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex items-center gap-3">
            {/* Circle indicator */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isComplete
                  ? 'bg-green-500'
                  : isCurrent
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-gray-200'
              }`}
            >
              {isComplete ? (
                <Check className="w-5 h-5 text-white" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <span className="text-sm text-gray-400">{index + 1}</span>
              )}
            </div>

            {/* Message */}
            <span
              className={`text-sm transition-all duration-300 ${
                isComplete
                  ? 'text-green-700 font-medium'
                  : isCurrent
                  ? 'text-red-700 font-semibold'
                  : 'text-gray-400'
              }`}
            >
              {step.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}
