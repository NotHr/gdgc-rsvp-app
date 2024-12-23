// app/api/events/[eventId]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/event";
import mongoose from "mongoose";

export const GET = async (
  request: Request,
  { params }: { params: { eventId: string } },
) => {
  console.log("Received eventId:", params.eventId); // Debug log

  if (!params?.eventId) {
    return NextResponse.json(
      { message: "Event ID is required" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.eventId)) {
      console.log("Invalid ObjectId format"); // Debug log
      return NextResponse.json(
        { message: "Invalid Event ID format" },
        { status: 400 },
      );
    }

    const objectId = new mongoose.Types.ObjectId(params.eventId);
    console.log("Looking for ObjectId:", objectId.toString()); // Debug log

    const event = await Event.findById(objectId);
    console.log("Found event:", event); // Debug log

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
};
