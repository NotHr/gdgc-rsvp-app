import connectDB from "@/lib/db";
import Event, { IEvent } from "@/models/event";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
  event?: IEvent[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const events = await Event.find().limit(10);
        return res.status(200).json({
          message: "Fetched events successfully",
          event: events,
        });
      } catch (error) {
        console.error("Error in fetching events:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

    case "POST":
      try {
        const { title, description, category, date, location, organizer } =
          req.body;

        if (
          !title ||
          !description ||
          !category ||
          !date ||
          !location ||
          !organizer
        ) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const newEvent = new Event({
          title,
          description,
          category,
          date,
          location,
          organizer,
        });

        const savedEvent = await newEvent.save();
        return res.status(201).json({
          message: "Event created successfully",
          event: savedEvent,
        });
      } catch (error) {
        console.error("Error in creating event:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

    case "PUT":
      try {
        const { id } = req.query;
        const { title, description, category, date, location } = req.body;

        if (!id) {
          return res.status(400).json({ message: "Event ID is required" });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
          id,
          { title, description, category, date, location },
          { new: true },
        );

        if (!updatedEvent) {
          return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json({
          message: "Event updated successfully",
          event: updatedEvent,
        });
      } catch (error) {
        console.error("Error in updating event:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
