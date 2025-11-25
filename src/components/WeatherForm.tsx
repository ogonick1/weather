import React, { type FormEvent, useCallback } from "react";
import type { WeatherFormProps } from "../types/weather";



export const WeatherForm: React.FC<WeatherFormProps> = ({
  city,
  onCityChange,
  onSubmit,
  loading,
}) => {
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        value={city}
        onChange={(e) => onCityChange(e.target.value)}
        placeholder="Введи місто (наприклад, Київ)"
        className="flex-1 rounded-lg px-4 py-2 bg-slate-800 text-slate-100 placeholder:text-slate-400 border border-slate-700 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !city.trim()}
        className="inline-flex justify-center items-center px-6 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
      >
        {loading ? "Завантаження..." : "Отримати прогноз"}
      </button>
    </form>
  );
};
