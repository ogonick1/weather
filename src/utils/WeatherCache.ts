const CACHE_TTL = 10 * 60 * 1000;
const ERROR_TTL = 10 * 60 * 1000;

const makeKey = (city: string) => `weather:${city.trim().toLowerCase()}`;
const makeErrorKey = (city: string) =>
  `weather_error:${city.trim().toLowerCase()}`;

export type WeatherCacheItem<T> = {
  data: T;
  timestamp: number;
};

export function getCachedWeather<T>(city: string): T | null {
  try {
    const raw = localStorage.getItem(makeKey(city));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as WeatherCacheItem<T>;
    const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;

    if (isExpired) {
      localStorage.removeItem(makeKey(city));
      return null;
    }

    return parsed.data;
  } catch (e) {
    console.error("Error reading cache:", e);
    return null;
  }
}

export function setCachedWeather<T>(city: string, data: T): void {
  try {
    const item: WeatherCacheItem<T> = {
      data,
      timestamp: Date.now(),
    };

    localStorage.setItem(makeKey(city), JSON.stringify(item));
  } catch (e) {
    console.error("Error writing cache:", e);
  }
}

export type ErrorCacheItem = {
  timestamp: number;
};

export function markCityNotFound(city: string): void {
  try {
    const item: ErrorCacheItem = {
      timestamp: Date.now(),
    };

    localStorage.setItem(makeErrorKey(city), JSON.stringify(item));
  } catch (e) {
    console.error("Error writing error cache:", e);
  }
}

export function isCityTemporarilyBlocked(city: string): boolean {
  try {
    const raw = localStorage.getItem(makeErrorKey(city));
    if (!raw) return false;

    const parsed = JSON.parse(raw) as ErrorCacheItem;
    const isExpired = Date.now() - parsed.timestamp > ERROR_TTL;

    if (isExpired) {
      localStorage.removeItem(makeErrorKey(city));
      return false;
    }

    return true;
  } catch (e) {
    console.error("Error reading error cache:", e);
    return false;
  }
}
