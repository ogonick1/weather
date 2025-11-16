import React, { useEffect, useState } from "react";
import { WeatherForm } from "./components/WeatherForm";
import { WeatherCard } from "./components/WeatherCard";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  type WeatherResponse,
} from "./api/weather";
import { WeatherShowcase } from "./components/WeatherShowcase";
import { WeatherCardSkeleton } from "./components/WeatherCardSkeleton";

const GEO_PROMPT_KEY = "weather:geoPromptAsked";

const App: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [geoPromptVisible, setGeoPromptVisible] = useState(false);
  const [geoSupported, setGeoSupported] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setGeoSupported(true);
      const alreadyAsked = localStorage.getItem(GEO_PROMPT_KEY);
      if (!alreadyAsked) {
        setGeoPromptVisible(true);
      }
    }
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherByCity(city);
      setWeather(data);
    } catch (e) {
      const err = e as Error;
      setWeather(null);
      setError(err?.message || "Сталася помилка");
    } finally {
      setLoading(false);
    }
  };

  const handleDismissGeo = () => {
    setGeoPromptVisible(false);
    //dont ask again
    //localStorage.setItem(GEO_PROMPT_KEY, "1");
  };

  const handleUseGeolocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Браузер не підтримує геолокацію");
      handleDismissGeo();
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const data = await fetchWeatherByCoords(latitude, longitude);
          setWeather(data);
          setCity(data.name ?? "");
        } catch (e) {
          const err = e as Error;
          setWeather(null);
          setError(err.message || "Не вдалося отримати погоду за геолокацією");
        } finally {
          setLoading(false);
          handleDismissGeo();
        }
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        setError("Не вдалося визначити місце розташування");
        setLoading(false);
        handleDismissGeo();
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold mb-2">Прогноз погоди</h1>
          <p className="text-sm text-slate-400">
            Введи назву міста й отримай поточну погоду.
          </p>
          <p className="text-sm text-slate-400">Дані кешуються на 10 хвилин.</p>
        </div>

        <WeatherForm
          city={city}
          onCityChange={setCity}
          onSubmit={handleSearch}
          loading={loading}
        />

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/60 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        )}

        {loading && !weather && (
          <div className="mt-2">
            <WeatherCardSkeleton />
          </div>
        )}

        {!loading && weather && <WeatherCard data={weather} />}

        {!weather && !error && !loading && (
          <div className="mt-4 text-xs text-slate-500 text-center">
            Наприклад: Київ, Львів, London, Warsaw
          </div>
        )}

        {!weather && !loading && <WeatherShowcase />}
        {geoSupported && geoPromptVisible && !loading && !weather && !error && (
          <div className="fixed top-2 z-10 right-2 rounded-xl border border-sky-500/50 bg-sky-500/10 px-4 py-3 text-sm flex flex-col gap-3">
            <div>Хочеш подивитись погоду у твоєму місці?</div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleDismissGeo}
                className="px-3 py-1 rounded-lg border border-slate-500 text-slate-200 text-xs hover:bg-slate-800/60"
              >
                Ні, дякую
              </button>
              <button
                type="button"
                onClick={handleUseGeolocation}
                className="px-4 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-xs font-semibold"
              >
                Так, показати
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
