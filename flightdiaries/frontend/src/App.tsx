import { useEffect, useState, type SyntheticEvent } from "react";
import axios from "axios";
import {
  VISIBILITY_OPTIONS,
  WEATHER_OPTIONS,
  type DiaryEntry,
  type NonSensitiveDiaryEntry,
  type Visibility,
  type Weather,
} from "./types";
import { createDiary, getAllDiaries } from "./services/diaryService";

interface ZodErrorItem {
  message?: string;
}

const getErrorMessage = (data: unknown, fallback: string): string => {
  if (data && typeof data === "object" && "error" in data) {
    const err = (data as { error?: unknown }).error;

    if (typeof err === "string" && err.length > 0) {
      return err;
    }

    if (Array.isArray(err)) {
      const messages = (err as ZodErrorItem[])
        .map((item) => item.message)
        .filter(
          (msg): msg is string => typeof msg === "string" && msg.length > 0,
        );

      if (messages.length > 0) {
        return messages.join(", ");
      }
    }
  }

  return fallback;
};

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("great");
  const [weather, setWeather] = useState<Weather>("sunny");
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const data = await getAllDiaries();
        setDiaries(data);
      } catch (error: unknown) {
        console.error("Failed to fetch diaries:", error);
      }
    };

    void fetchDiaries();
  }, []);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const diaryCreation = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      const created: DiaryEntry = await createDiary({
        date,
        visibility,
        weather,
        comment,
      });

      const newEntryForList: NonSensitiveDiaryEntry = {
        id: created.id,
        date: created.date,
        visibility: created.visibility,
        weather: created.weather,
      };

      setDiaries((prev) => prev.concat(newEntryForList));
      setDate("");
      setComment("");
      setErrorMessage(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        showError(
          getErrorMessage(
            error.response?.data,
            error.message || "Failed to create diary entry",
          ),
        );
      } else {
        showError("Unknown error occurred");
      }
    }
  };

  return (
    <div>
      {errorMessage && <p style={{ color: "red" }}>Error: {errorMessage}</p>}

      <h2>Add new entry</h2>
      <form onSubmit={diaryCreation}>
        <div>
          <label>
            date{" "}
            <input
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                if (errorMessage) {
                  setErrorMessage(null);
                }
              }}
            />
          </label>
        </div>

        <div>
          <span>visibility: </span>
          {VISIBILITY_OPTIONS.map((option) => (
            <label key={option} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={visibility === option}
                onChange={() => setVisibility(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div>
          <span>weather: </span>
          {WEATHER_OPTIONS.map((option) => (
            <label key={option} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="weather"
                value={option}
                checked={weather === option}
                onChange={() => setWeather(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div>
          <label>
            comment{" "}
            <input
              type="text"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>visibility: {diary.visibility}</p>
          <p>weather: {diary.weather}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
