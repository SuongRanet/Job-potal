import mongoose, { Schema, Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // argon2 hash, never stored in plain text
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true, select: false },


  },
  { timestamps: true },
);

const User =
  (mongoose.models.User as mongoose.Model<IUser> | undefined) ??
  mongoose.model<IUser>("User", userSchema);

export default User;
