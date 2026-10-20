import mongoose, { Schema, Types } from "mongoose";

export const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "CONTRACT",
] as const;
export const JOB_STATUSES = ["OPEN", "CLOSED"] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type JobStatus = (typeof JOB_STATUSES)[number];

export interface IJob {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  company: string;
  location: Types.ObjectId;
  salary?: { min?: number; max?: number; currency: string };
  employmentType: EmploymentType;
  category: string;
  requirements: string[];
  apply: { email?: string; telegram?: string };
  employer: Types.ObjectId;
  deadline?: Date | null;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
      index: true,
    },

    salary: {
      type: new Schema(
        {
          min: { type: Number, min: 0 },
          max: { type: Number, min: 0 },
          currency: {
            type: String,
            default: "USD",
            uppercase: true,
            trim: true,
          },
        },
        { _id: false },
      ),
    },

    employmentType: { type: String, enum: EMPLOYMENT_TYPES, required: true },
    category: { type: String, required: true, trim: true },
    requirements: { type: [String], default: [] },

    apply: {
      type: new Schema(
        {
          email: { type: String, lowercase: true, trim: true },
          telegram: { type: String, trim: true },
        },
        { _id: false },
      ),
      required: true,
    },

    employer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: JOB_STATUSES,
      default: "OPEN",
      required: true,
    },
  },
  { timestamps: true },
);

jobSchema.index({ status: 1, deadline: 1, createdAt: -1 });

const Job =
  (mongoose.models.Job as mongoose.Model<IJob> | undefined) ??
  mongoose.model<IJob>("Job", jobSchema);

export default Job;
