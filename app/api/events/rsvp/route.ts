import { NextRequest, NextResponse } from "next/server";
import RSVP from "@/models/rsvp";
import Event from "@/models/event";
import { getTokenData } from "@/lib/getTokenData";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    // Get request data
    const { eventId } = await request.json();
    const userId = getTokenData(request);

    if (!eventId || !userId) {
      return NextResponse.json(
        { message: "Event ID and authentication required" },
        { status: 400 },
      );
    }

    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { message: "Invalid event ID format" },
        { status: 400 },
      );
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Check for existing RSVP
    const existingRsvp = await RSVP.findOne({ event: eventId, user: userId });
    if (existingRsvp) {
      return NextResponse.json({ message: "Already RSVPed" }, { status: 400 });
    }

    // Create RSVP
    const rsvp = new RSVP({
      user: userId,
      event: eventId,
      status: "accepted",
    });

    await rsvp.save();

    return NextResponse.json({ message: "RSVP successful" }, { status: 200 });
  } catch (error) {
    console.error("RSVP Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
