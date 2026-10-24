import express from "express";
import { calculateBmi } from "./bmiCalculator.ts";
import { calculateExercises } from "./exerciseCalculator.ts";
import { isNotNumber } from "./utils.ts";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const heightQuery = req.query.height;
  const weightQuery = req.query.weight;

  if (
    !heightQuery ||
    !weightQuery ||
    typeof heightQuery !== "string" ||
    typeof weightQuery !== "string" ||
    isNotNumber(heightQuery) ||
    isNotNumber(weightQuery)
  ) {
    res.status(400).json({ error: "malformatted parameters" });
    return;
  }

  const height = Number(heightQuery);
  const weight = Number(weightQuery);
  const bmi = calculateBmi(height, weight);

  res.json({
    weight,
    height,
    bmi,
  });
});

app.post("/exercises", (req, res) => {
  const { daily_exercises, target } = req.body as {
    daily_exercises: any;
    target: any;
  };

  if (!daily_exercises || target === undefined) {
    res.status(400).json({ error: "parameters missing" });
    return;
  }

  if (
    !Array.isArray(daily_exercises) ||
    isNaN(Number(target)) ||
    typeof target === "boolean"
  ) {
    res.status(400).json({ error: "malformatted parameters" });
    return;
  }

  const parsedDailyHours = daily_exercises.map((hours) => Number(hours));
  if (
    parsedDailyHours.some((hours) => isNaN(hours) || typeof hours !== "number")
  ) {
    res.status(400).json({ error: "malformatted parameters" });
    return;
  }

  const parsedTarget = Number(target);

  try {
    const result = calculateExercises(parsedDailyHours, parsedTarget);
    res.json(result);
  } catch (_error: unknown) {
    res.status(400).json({ error: "malformatted parameters" });
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
