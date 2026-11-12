import React, { useEffect, useState } from 'react';
import type { Goal, Activity } from '../types';
import { cn } from '@/lib/utils';

interface RunningTrackWidgetProps {
  weeklyGoal: Goal;
  activities: Activity[];
  className?: string;
}

export const RunningTrackWidget: React.FC<RunningTrackWidgetProps> = ({
  weeklyGoal,
  activities,
  className
}) => {
  const [displayedKm, setDisplayedKm] = useState(0);

  const runningKm = activities
    .filter((a) => a.type === 'Running')
    .reduce((acc, a) => acc + a.distance, 0);

  const target = weeklyGoal.target;
  const percentage = Math.min(100, (runningKm / target) * 100);
  const remaining = Math.max(0, target - runningKm);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
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

  // Stadium geometry
  const width = 300;
  const height = 150;
  const r = 60;
  const straight = 120;
  const strokeWidth = 16;
  const padding = 20;
  const startX = (width - straight) / 2;
  const startY = padding;

  const stadiumPath = `
    M ${startX} ${startY}
    h ${straight}
    a ${r} ${r} 0 0 1 0 ${r * 2}
    h -${straight}
    a ${r} ${r} 0 0 1 0 -${r * 2}
    z
  `.replace(/\s+/g, ' ').trim();

  const perimeter = 2 * straight + 2 * Math.PI * r;
  const dashOffset = perimeter * (1 - percentage / 100);

  return (
    <div className={cn("flex flex-col items-center w-full", className)}>
      <div className="w-full relative aspect-[2/1.1] sm:aspect-[2/1] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height + padding * 2}`}
          className="w-full h-full max-h-[400px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF3038" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Track Base */}
          <path
            d={stadiumPath}
            fill="none"
            stroke="#1A1C1E"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Lane Lines */}
          <path
            d={stadiumPath}
            fill="none"
            stroke="#08090B"
            strokeWidth="1"
            strokeDasharray="4 6"
            opacity="0.4"
          />

          {/* Progress */}
          <path
            d={stadiumPath}
            fill="none"
            stroke="url(#trackGrad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={perimeter}
            strokeDashoffset={dashOffset}
            className="transition-all duration-[2000ms] ease-out"
            filter="url(#glow)"
          />

          {/* Runner Pointer */}
          <circle
            r="6"
            fill="#FFFFFF"
            className="shadow-2xl"
            style={{
              offsetPath: `path("${stadiumPath}")`,
              offsetDistance: `${percentage}%`,
              transition: 'offset-distance 2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] sm:text-xs font-black text-[#8B929E] uppercase tracking-[0.4em] mb-1">KILÓMETROS</span>
          <span className="text-6xl sm:text-8xl font-black text-white tracking-tighter tabular-nums leading-none">
            {displayedKm.toFixed(1)}
          </span>
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-[#FF3038] text-white text-[10px] font-black px-2 py-0.5 rounded-full italic">
              {percentage.toFixed(0)}%
            </span>
            <span className="text-[10px] font-bold text-[#8B929E] uppercase tracking-widest">OBJETIVO</span>
          </div>
        </div>
      </div>

      {/* Sub-metrics */}
      <div className="grid grid-cols-2 gap-px bg-[#24272D] w-full mt-10 rounded-2xl overflow-hidden border border-[#24272D]">
        <div className="bg-[#08090B] p-6 flex flex-col items-center">
          <span className="text-[10px] font-black text-[#8B929E] uppercase tracking-widest mb-1">Restantes</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white tabular-nums">{remaining.toFixed(1)}</span>
            <span className="text-xs font-bold text-[#444444]">KM</span>
          </div>
        </div>
        <div className="bg-[#08090B] p-6 flex flex-col items-center">
          <span className="text-[10px] font-black text-[#8B929E] uppercase tracking-widest mb-1">Semana</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white tabular-nums">{target}</span>
            <span className="text-xs font-bold text-[#444444]">KM</span>
          </div>
        </div>
      </div>
    </div>
  );
};