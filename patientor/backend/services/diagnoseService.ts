import diagnosesData from "../data/diagnoses.ts";
import type { Diagnosis } from "../types.ts";

const getEntries = (): Diagnosis[] => {
  return diagnosesData;
};

const addEntry = () => {};

export default {
  getEntries,
  addEntry,
};
