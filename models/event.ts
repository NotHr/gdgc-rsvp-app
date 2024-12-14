import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const eventSchema: Schema<IEvent> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
export default Event;
