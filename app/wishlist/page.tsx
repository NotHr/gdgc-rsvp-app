"use client";

import { useState } from "react";
import { IEvent } from "@/models/event";
import EventCard from "@/components/eventCard";

export default function Wishlist() {
  const [wishList] = useState<IEvent[]>([
    {
      _id: "63c1f20e1c4a4e1c9f4e3d2b",
      title: "Full-stack Development Workshop",
      description:
        "Learn how to build full-stack applications using modern technologies",
      date: new Date("2024-12-25T10:00:00Z"),
      location: "Shivaji auditorium",
      organizer: "63c1f20e1c4a4e1c9f4e3d2a",
    },
    {
      _id: "63c1f20e1c4a4e1c9f4e3d2e",
      title: "React Basics Workshop",
      description: "Introduction to React.js for beginners",
      date: new Date("2024-12-30T14:00:00Z"),
      location: "Kinnera hall",
      organizer: "63c1f20e1c4a4e1c9f4e3d2f",
    },
  ] as unknown as IEvent[]);

  return (
    <div className="bg-[#1a1a1a] px-6 pt-10 flex flex-col space-y-2 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-2">WishList</h1>
      {wishList?.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
}
