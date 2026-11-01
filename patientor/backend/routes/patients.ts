import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import patientService from "../services/patientService.ts";
import {
  newPatientSchema,
  type NewPatientEntry,
  type Patient,
} from "../types.ts";
import { z } from "zod";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(patientService.getNonSensitiveEntries());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
    const addedEntry = patientService.addPatient(req.body);
    res.json(addedEntry);
  },
);

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.use(errorMiddleware);

export default router;
