import React, { useEffect, useState } from 'react';
import type { Goal, Activity } from '../types';

interface RunningTrackWidgetProps {
  weeklyGoal: Goal;
  activities: Activity[];
}

export const RunningTrackWidget: React.FC<RunningTrackWidgetProps> = ({ weeklyGoal, activities }) => {
  const [displayedKm, setDisplayedKm] = useState(0);

  // Calculate running km for the current week (last 7 days)
  const runningKm = activities
    .filter((a) => a.type === 'Running')
    .reduce((acc, a) => acc + a.distance, 0);

  const target = weeklyGoal.target;
  const percentage = Math.min(100, (runningKm / target) * 100);
  const remaining = Math.max(0, target - runningKm);

  // Animate the counter up
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = runningKm / steps;
    let current = 0;
    if (runningKm === 0) {
      setDisplayedKm(0);
      return;
    }
    const timer = setInterval(() => {
      current += increment;
      if (current >= runningKm) {
        setDisplayedKm(runningKm);
        clearInterval(timer);
      } else {
        setDisplayedKm(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [runningKm]);

  /**
   * Stadium Shape Geometry (Realistic Athletic Track)
   * Straight segments: 80 units
   * Semicircles: Radius 40 units
   * Total length of one lap: 2 * 80 + 2 * PI * 40 ≈ 160 + 251.3 ≈ 411.3 units
   */
  const L = 100; // Length of straight
  const R = 45;  // Radius of curves
  const strokeWidth = 12;

  // Total path length calculation
  const pathLength = 2 * L + 2 * Math.PI * R;
  const dashOffset = pathLength * (1 - percentage / 100);

  // SVG Path for the stadium shape (starting from top left straight)
  // M (R) (0) -> Move to start of top straight
  // H (R + L) -> Top straight
  // A R R 0 0 1 (R + L) (2*R) -> Right curve
  // H (R) -> Bottom straight
  // A R R 0 0 1 (R) (0) -> Left curve
  const trackPath = `M ${R} 5 H ${R + L} A ${R} ${R} 0 0 1 ${R + L} ${2 * R + 5} H ${R} A ${R} ${R} 0 0 1 ${R} 5`;

  return (
    <div className="bg-[#111111] border border-[#222222] p-8 rounded-[2rem] flex flex-col items-center relative overflow-hidden shadow-2xl">
      <div className="flex justify-between items-center w-full mb-8">
        <div>
          <h3 className="text-xs font-bold text-[#666666] uppercase tracking-[0.2em]">Progreso Semanal</h3>
          <p className="text-lg font-bold text-white mt-1">Mi Pista</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black text-[#ff0000] tabular-nums leading-none">
            {percentage.toFixed(0)}%
          </span>
          <span className="text-[10px] text-[#444444] uppercase font-bold tracking-tighter mt-1">Completado</span>
        </div>
      </div>

      <div className="relative w-full aspect-[2/1] flex items-center justify-center mb-6">
        <svg
          viewBox={`0 0 ${L + 2 * R} ${2 * R + 10}`}
          className="w-full h-full drop-shadow-[0_0_15px_rgba(255,102,0,0.1)]"
        >
          {/* Track Background */}
          <path
            d={trackPath}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Track Lanes (Visual detail) */}
          <path
            d={`M ${R} 11 H ${R + L} A ${R-6} ${R-6} 0 0 1 ${R + L} ${2 * R - 1} H ${R} A ${R-6} ${R-6} 0 0 1 ${R} 11`}
            fill="none"
            stroke="#111111"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Progress Path */}
          <path
            d={trackPath}
            fill="none"
            stroke="url(#trackGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.65, 0, 0.35, 1)' }}
          />

          <defs>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cc0000" />
              <stop offset="100%" stopColor="#ff0000" />
            </linearGradient>
          </defs>

          {/* Runner Indicator Dot */}
          <circle
            r="4"
            fill="white"
            className="shadow-xl"
            style={{
              offsetPath: `path("${trackPath}")`,
              offsetDistance: `${percentage}%`,
              transition: 'offset-distance 1.5s cubic-bezier(0.65, 0, 0.35, 1)'
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none pt-2">
          <span className="text-5xl font-black text-white tracking-tighter tabular-nums">
            {displayedKm.toFixed(1)}
          </span>
          <span className="text-[10px] text-[#666666] font-bold uppercase tracking-[0.3em] mt-1">Kilómetros</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-[#222222] w-full rounded-2xl overflow-hidden mt-4">
        <div className="bg-[#111111] p-4 flex flex-col items-center">
          <span className="text-[9px] text-[#444444] uppercase font-black tracking-widest">Restantes</span>
          <p className="text-xl font-bold text-white mt-1 tabular-nums">{remaining.toFixed(1)} <span className="text-[10px] text-[#444444]">km</span></p>
        </div>
        <div className="bg-[#111111] p-4 flex flex-col items-center">
          <span className="text-[9px] text-[#444444] uppercase font-black tracking-widest">Objetivo</span>
          <p className="text-xl font-bold text-white mt-1 tabular-nums">{target} <span className="text-[10px] text-[#444444]">km</span></p>
        </div>
      </div>

      <div className="mt-6 w-full">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] text-[#444444] font-bold uppercase">Estado de la semana</span>
          <span className={`text-[10px] font-black uppercase ${percentage >= 80 ? 'text-[#ff0000]' : 'text-gray-500'}`}>
            {percentage >= 100 ? 'Objetivo cumplido' : percentage >= 75 ? 'En ritmo' : 'Aumentar carga'}
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full mt-2 overflow-hidden p-[2px]">
          <div
            className="h-full bg-[#ff0000] rounded-full transition-all duration-1000 shadow-[0_0_8px_#ff0000]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
