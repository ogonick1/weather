import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWeatherByCity, fetchWeatherByCoords } from "../api/weather";
import type { UseWeatherReturn, WeatherResponse } from "../types/weather";

const GEO_PROMPT_KEY = "weather:geoPromptAsked";



export const useWeather = (): UseWeatherReturn => {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [geoSupported, setGeoSupported] = useState(false);
  const [geoPromptVisible, setGeoPromptVisible] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);

  const cancelOngoingRequest = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setGeoSupported(true);
      const alreadyAsked = localStorage.getItem(GEO_PROMPT_KEY);
      if (!alreadyAsked) {
        setGeoPromptVisible(true);
      }
    }
  }, []);

  useEffect(
    () => () => {
      cancelOngoingRequest();
    },
    [cancelOngoingRequest]
  );

  const dismissGeoPrompt = useCallback(() => {
    setGeoPromptVisible(false);
    // for one ask
    //localStorage.setItem(GEO_PROMPT_KEY, "1");
  }, []);

  const searchByCity = useCallback(async () => {
    try {
      cancelOngoingRequest();

      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);

      const data = await fetchWeatherByCity(city, controller.signal);
      setWeather(data);
    } catch (e) {
      const err = e as Error & { name?: string };

      if (err.name === "AbortError") {
        return;
      }

      setWeather(null);
      setError(err?.message || "Сталася помилка");
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  }, [cancelOngoingRequest, city]);

  const searchByGeolocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Браузер не підтримує геолокацію");
      dismissGeoPrompt();
      return;
    }

    cancelOngoingRequest();

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const data = await fetchWeatherByCoords(
            latitude,
            longitude,
            controller.signal
          );
          setWeather(data);
          setCity(data.name ?? "");
        } catch (e) {
          const err = e as Error & { name?: string };

          if (err.name === "AbortError") {
            return;
          }

          setWeather(null);
          setError(
            err.message || "Не вдалося отримати погоду за геолокацією"
          );
        } finally {
          setLoading(false);
          controllerRef.current = null;
          dismissGeoPrompt();
        }
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        setError("Не вдалося визначити місце розташування");
        setLoading(false);
        controllerRef.current = null;
        dismissGeoPrompt();
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
      }
    );
  }, [cancelOngoingRequest, dismissGeoPrompt]);

  return {
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
  };
};
