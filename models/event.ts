import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  catageory: "sports" | "all" | "cultural" | "educational" | "art" | "unlisted";
  date: Date;
  location: string;
  organizer: mongoose.Types.ObjectId;
  createdAt: Date;
}

const eventSchema: Schema<IEvent> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    catageory: {
      type: String,
      enum: ["sports", "all", "educational", "cultural", "art", "unlisted"],
      default: "unlisted",
    },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
export default Event;
