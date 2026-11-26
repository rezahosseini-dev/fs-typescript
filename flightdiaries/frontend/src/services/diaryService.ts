import axios from "axios";
import type {
  DiaryEntry,
  NewDiaryEntry,
  NonSensitiveDiaryEntry,
} from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

export const getAllDiaries = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const response = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return response.data;
};
export const createDiary = async (
  object: NewDiaryEntry,
): Promise<DiaryEntry> => {
  const response = await axios.post<DiaryEntry>(baseUrl, object);
  return response.data;
};
