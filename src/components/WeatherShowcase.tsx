import React, { useEffect, useState } from "react";
import { WeatherCard } from "./WeatherCard";
import type { WeatherResponse } from "../types/weather";

const mockWeathers: WeatherResponse[] = [
  {
    name: "Sun",
    main: { temp: 25, feels_like: 26, humidity: 40 },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "ясно",
        icon: "01d",
      },
    ],
    wind: { speed: 3 },
  },
  {
    name: "Rain",
    main: { temp: 12, feels_like: 10, humidity: 85 },
    weather: [
      {
        id: 500,
        main: "Rain",
        description: "дощ",
        icon: "10d",
      },
    ],
    wind: { speed: 7 },
  },
  {
    name: "Snow",
    main: { temp: -3, feels_like: -7, humidity: 90 },
    weather: [
      {
        id: 600,
        main: "Snow",
        description: "сніг",
        icon: "13d",
      },
    ],
    wind: { speed: 4 },
  },
  {
    name: "Clouds",
    main: { temp: 5, feels_like: 3, humidity: 67 },
    weather: [
      {
        id: 804,
        main: "Clouds",
        description: "хмарно",
        icon: "04n",
      },
    ],
    wind: { speed: 3 },
  },
];

export const WeatherShowcase: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const length = mockWeathers.length;

  const currentIndex = step % length;
  const prevIndex = step === 0 ? null : (step - 1) % length;

  const current = mockWeathers[currentIndex];
  const prev = prevIndex !== null ? mockWeathers[prevIndex] : null;

  return (
    <>
      <div className="mb-2 mt-4 text-center text-lg font-medium">
        Приклад відповіді
      </div>

      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          {prev && (
            <div
              key={`prev-${prevIndex}-${step}`}
              className="absolute inset-0 animate-fade-out"
            >
              <WeatherCard data={prev} />
            </div>
          )}
          <div
            key={`current-${currentIndex}-${step}`}
            className="relative animate-fade-in"
          >
            <WeatherCard data={current} />
          </div>
        </div>
      </div>
    </>
  );
};
