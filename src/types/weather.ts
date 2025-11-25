export type WeatherResponse = {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
    id?: number;
  }[];
  wind: {
    speed: number;
  };
};

export type ErrorMessageProps = {
  message: string;
};
export type GeoPromptProps = {
  visible: boolean;
  canShow: boolean;
  loading: boolean;
  hasWeatherOrError: boolean;
  onDismiss: () => void;
  onUseGeolocation: () => void;
};

export type WeatherFormProps = {
  city: string;
  onCityChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export type UseWeatherReturn = {
  city: string;
  setCity: (value: string) => void;
  weather: WeatherResponse | null;
  loading: boolean;
  error: string | null;
  geoSupported: boolean;
  geoPromptVisible: boolean;
  searchByCity: () => void;
  dismissGeoPrompt: () => void;
  searchByGeolocation: () => void;
};
