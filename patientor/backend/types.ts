import { z } from "zod";

export const Gender = {
  Male: "male",
  Female: "female",
  Other: "other",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.enum(Object.values(Gender) as [string, ...string[]]),
  occupation: z.string(),
});

export type NewPatientEntry = z.infer<typeof newPatientSchema>;

export interface Patient extends NewPatientEntry {
  id: string;
}

export type NonSensitivePatient = Omit<Patient, "ssn">;
