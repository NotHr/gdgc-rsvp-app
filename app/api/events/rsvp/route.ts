import { NextResponse } from "next/server";
import RSVP from "@/models/rsvp";
import Event from "@/models/event"; // Assuming you have an Event model
import { verify } from "jsonwebtoken"; // JWT verification

export async function POST(request: Request) {
  try {
    const { eventId, userId } = await request.json();

    if (!eventId || !userId) {
      return NextResponse.json(
        { message: "Event and User ID are required" },
        { status: 400 },
      );
    }

    // Verify JWT token if required
    const token = request.headers.get("Authorization")?.split(" ")[1]; // Assuming token is in the "Authorization" header
    if (token) {
      try {
        const decoded = verify(token, process.env.JWT_SECRET); // Decode and verify token
        if (decoded.userId !== userId) {
          return NextResponse.json(
            { message: "Invalid token" },
            { status: 401 },
          );
        }
      } catch (err) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }
    } else {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 },
      );
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Check if the user has already RSVPed
    const existingRsvp = await RSVP.findOne({ event: eventId, user: userId });
    if (existingRsvp) {
      return NextResponse.json({ message: "Already RSVPed" }, { status: 400 });
    }

    // Create a new RSVP
    const rsvp = new RSVP({
      user: userId,
      event: eventId,
      status: "accepted", // You can adjust this logic
    });

    await rsvp.save();
    return NextResponse.json({ message: "RSVP successful" }, { status: 200 });
  } catch (error) {
    console.error("Error in RSVP:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
