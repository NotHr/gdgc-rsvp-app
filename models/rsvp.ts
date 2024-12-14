import mongoose, { Document, Schema } from "mongoose";

export interface IRsvp extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  status: "accepted" | "declined" | "pending";
  createdAt: Date;
}

const rsvpSchema: Schema<IRsvp> = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["accepted", "declined", "pending"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const RSVP = mongoose.models.RSVP || mongoose.model<IRsvp>("RSVP", rsvpSchema);
export default RSVP;
