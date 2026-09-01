import React from 'react';

export default function ConfidenceBadge({ confidence }) {
  const score = Math.min(100, Math.max(0, confidence || 90));
  
  let color = 'from-emerald-500 to-teal-400';
  let textColor = 'text-emerald-400';

  if (score < 75) {
    color = 'from-rose-500 to-amber-500';
    textColor = 'text-rose-400';
  } else if (score < 85) {
    color = 'from-amber-500 to-yellow-400';
    textColor = 'text-amber-400';
  }

  return (
    <div className="flex flex-col gap-1 w-full max-w-[140px]">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">AI Confidence</span>
        <span className={`font-bold ${textColor}`}>{score}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden p-0.5 border border-slate-700/50">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}
