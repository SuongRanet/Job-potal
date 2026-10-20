import mongoose, { Schema, Types } from "mongoose";

export const LOCATION_TYPES = ["capital", "province"] as const;
export type LocationType = (typeof LOCATION_TYPES)[number];

export interface ILocation {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  type: LocationType;
}

const locationSchema = new Schema<ILocation>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  type: { type: String, enum: LOCATION_TYPES, required: true },
});

const Location =
  (mongoose.models.Location as mongoose.Model<ILocation> | undefined) ??
  mongoose.model<ILocation>("Location", locationSchema, "locations");

export default Location;
