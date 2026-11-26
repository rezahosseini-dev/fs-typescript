export const WEATHER_OPTIONS = [
  "sunny",
  "rainy",
  "cloudy",
  "stormy",
  "windy",
] as const;
export type Weather = (typeof WEATHER_OPTIONS)[number];

export const VISIBILITY_OPTIONS = ["great", "good", "ok", "poor"] as const;
export type Visibility = (typeof VISIBILITY_OPTIONS)[number];

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

export type NonSensitiveDiaryEntry = Omit<DiaryEntry, "comment">;

export type NewDiaryEntry = Omit<DiaryEntry, "id">;
