import React, { useMemo } from "react";
import type { WeatherResponse } from "../types/weather";

type Props = {
  data: WeatherResponse;
};

function getWeatherTheme(main: string) {
  const key = main.toLowerCase();

  if (key.includes("clear")) {
    return {
      bg: "from-amber-400/80 via-orange-500/80 to-rose-500/80",
      border: "border-amber-300/70",
    };
  }

  if (
    key.includes("rain") ||
    key.includes("drizzle") ||
    key.includes("thunder")
  ) {
    return {
      bg: "from-sky-700/80 via-sky-800/80 to-slate-900/90",
      border: "border-sky-400/60",
    };
  }

  if (key.includes("snow")) {
    return {
      bg: "from-sky-200/80 via-sky-300/80 to-slate-200/80",
      border: "border-sky-300/80",
    };
  }

  if (key.includes("cloud")) {
    return {
      bg: "from-slate-500/80 via-slate-600/80 to-slate-800/90",
      border: "border-slate-300/60",
    };
  }

  return {
    bg: "from-slate-700/80 via-slate-800/80 to-slate-900/90",
    border: "border-slate-500/70",
  };
}

export const WeatherCard: React.FC<Props> = ({ data }) => {
  const mainWeather = data.weather[0];

  const theme = useMemo(
    () => getWeatherTheme(mainWeather.main),
    [mainWeather.main]
  );

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${theme.border} bg-gradient-to-br ${theme.bg} shadow-xl p-6 flex flex-col gap-4`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-100/80 mb-1">
            {data.name}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-semibold leading-none">
              {Math.round(data.main.temp)}°C
            </span>
          </div>
          <div className="text-sm text-slate-100/90 capitalize">
            {mainWeather.description}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <img
            alt={mainWeather.description}
            src={`https://openweathermap.org/img/wn/${mainWeather.icon}@2x.png`}
            className="w-16 h-16 drop-shadow-lg"
          />
          <span className="text-xs mt-1 bg-slate-900/30 px-2 py-0.5 rounded-full">
            {mainWeather.main}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm mt-2">
        <div className="bg-slate-900/30 rounded-xl px-3 py-2">
          <div className="text-slate-100/80">Вологість</div>
          <div className="font-semibold">{data.main.humidity}%</div>
        </div>
        <div className="bg-slate-900/30 rounded-xl px-3 py-2">
          <div className="text-slate-100/80">Вітер</div>
          <div className="font-semibold">
            {Math.round(data.wind.speed)} м/с
          </div>
        </div>
        <div className="bg-slate-900/30 rounded-xl px-3 py-2">
          <div className="text-slate-100/80">Відчувається</div>
          <div className="font-semibold">
            ~{Math.round(data.main.feels_like)}°C
          </div>
        </div>
      </div>
    </div>
  );
};
