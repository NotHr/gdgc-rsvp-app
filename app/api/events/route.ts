import connectDB from "@/lib/db";
import Event from "@/models/event";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

// GET method - Fetch events
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().limit(10);
    return NextResponse.json(
      { message: "Fetched events successfully", event: events },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in fetching events:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST method - Create a new event with file upload
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const organizer = formData.get("organizer") as string;
    const image = formData.get("image") as File;

    // Validate required fields
    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !location ||
      !organizer
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    let imageUrl = "";

    // Handle image upload if present
    if (image) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${image.name}`;
        const uploadDir = join(process.cwd(), "public/uploads");
        const filepath = join(uploadDir, filename);

        // Write file to public/uploads directory
        await writeFile(filepath, buffer);
        imageUrl = `/uploads/${filename}`;
      } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
          { message: "Error uploading file" },
          { status: 500 },
        );
      }
    }

    await connectDB();

    const newEvent = new Event({
      title,
      description,
      category,
      date,
      location,
      organizer,
      image: imageUrl, // Add the image URL to the event
    });

    const savedEvent = await newEvent.save();

    return NextResponse.json(
      { message: "Event created successfully", event: savedEvent },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in creating event:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
