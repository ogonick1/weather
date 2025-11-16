import React from "react";

export const WeatherCardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/60 shadow-xl p-6">
      <div className="animate-pulse space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-slate-700 rounded-full" />
            <div className="h-10 w-32 bg-slate-700 rounded-lg" />
            <div className="h-3 w-28 bg-slate-700 rounded-full" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-slate-700 rounded-2xl" />
            <div className="h-4 w-16 bg-slate-700 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-900/60 rounded-xl px-3 py-3 space-y-2"
            >
              <div className="h-3 w-16 bg-slate-700 rounded-full" />
              <div className="h-4 w-10 bg-slate-600 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
