import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  profilePic?: string;
  role: "student" | "admin" | "faculty";
  createdAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: false },
    profilePic: { type: String, default: "default.jpg" },
    role: {
      type: String,
      enum: ["student", "admin", "faculty"],
      default: "student",
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
