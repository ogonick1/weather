import {
  getCachedWeather,
  setCachedWeather,
  isCityTemporarilyBlocked,
  markCityNotFound,
} from "../utils/WeatherCache";
import type { WeatherResponse } from "../types/weather";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const getApiKey = (): string => {
  const key = import.meta.env.VITE_WEATHER_API_KEY;
  if (!key) {
    throw new Error("API key is missing");
  }
  return key;
};

export async function fetchWeatherByCity(
  city: string,
  signal?: AbortSignal
): Promise<WeatherResponse> {
  const trimmedCity = city.trim();
  if (!trimmedCity) {
    throw new Error("Введіть назву міста");
  }

  if (isCityTemporarilyBlocked(trimmedCity)) {
    throw new Error(
      "Це місто раніше не було знайдено. Змініть назву перед новим запитом."
    );
  }

  const cached = getCachedWeather<WeatherResponse>(trimmedCity);
  if (cached) {
    return cached;
  }

  const apiKey = getApiKey();

  const url = `${BASE_URL}?q=${encodeURIComponent(
    trimmedCity
  )}&appid=${apiKey}&units=metric&lang=ua`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    if (res.status === 404) {
      markCityNotFound(trimmedCity);
      throw new Error("Місто не знайдено");
    }

    throw new Error("Помилка при запиті до API погоди");
  }

  const data: WeatherResponse = await res.json();
  setCachedWeather(trimmedCity, data);
  return data;
}

export async function fetchWeatherByCoords(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<WeatherResponse> {
  const apiKey = getApiKey();

  const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  const cached = getCachedWeather<WeatherResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ua`;
  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error("Не вдалося отримати погоду за геолокацією");
  }

  const data: WeatherResponse = await res.json();
  setCachedWeather<WeatherResponse>(cacheKey, data);
  return data;
}
