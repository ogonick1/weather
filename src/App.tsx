import React from "react";
import { WeatherForm } from "./components/WeatherForm";
import { WeatherCard } from "./components/WeatherCard";
import { WeatherShowcase } from "./components/WeatherShowcase";
import { WeatherCardSkeleton } from "./components/WeatherCardSkeleton";
import { useWeather } from "./hooks/useWeather";
import { GeoPrompt } from "./components/GeoPrompt";
import { ErrorMessage } from "./components/ErrorMessage";

const App: React.FC = () => {
  const {
    city,
    setCity,
    weather,
    loading,
    error,
    geoSupported,
    geoPromptVisible,
    searchByCity,
    dismissGeoPrompt,
    searchByGeolocation,
  } = useWeather();

  const hasWeatherOrError = Boolean(weather || error);

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
          onSubmit={searchByCity}
          loading={loading}
        />

        {error && <ErrorMessage message={error} />}

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

        <GeoPrompt
          visible={geoPromptVisible}
          canShow={geoSupported}
          loading={loading}
          hasWeatherOrError={hasWeatherOrError}
          onDismiss={dismissGeoPrompt}
          onUseGeolocation={searchByGeolocation}
        />
      </div>
    </div>
  );
};

export default App;
