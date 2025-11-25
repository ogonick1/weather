import React from "react";
import type { GeoPromptProps } from "../types/weather";



export const GeoPrompt: React.FC<GeoPromptProps> = ({
  visible,
  canShow,
  loading,
  hasWeatherOrError,
  onDismiss,
  onUseGeolocation,
}) => {
  if (!canShow || !visible || loading || hasWeatherOrError) {
    return null;
  }

  return (
    <div className="fixed top-2 z-10 right-2 rounded-xl border border-sky-500/50 bg-sky-500/10 px-4 py-3 text-sm flex flex-col gap-3 max-w-xs">
      <div>Хочеш подивитись погоду у твоєму місці?</div>
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onDismiss}
          className="px-3 py-1 rounded-lg border border-slate-500 text-slate-200 text-xs hover:bg-slate-800/60"
        >
          Ні, дякую
        </button>
        <button
          type="button"
          onClick={onUseGeolocation}
          className="px-4 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-xs font-semibold"
        >
          Так, показати
        </button>
      </div>
    </div>
  );
};
