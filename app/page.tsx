"use client";
import testImage from "@/public/test-carousel.jpg";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Music,
  GraduationCap,
  Trophy,
  Palette,
  Speech,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { IEvent } from "@/models/event";
import EventCard from "@/components/eventCard";

type FeaturedEvent = {
  date: string;
};

const featuredEvents: FeaturedEvent[] = [
  {
    date: "10 JUNE",
  },
  {
    date: "15 JULY",
  },
  {
    date: "20 AUGUST",
  },
  {
    date: "5 SEPTEMBER",
  },
  {
    date: "10 OCTOBER",
  },
];

export default function EventsPage() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [events, setEvents] = useState<IEvent[]>([
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
  ]);

  const nextEvent = () => {
    setCurrentEventIndex(
      (prevIndex) => (prevIndex + 1) % featuredEvents.length
    );
  };

  const prevEvent = () => {
    setCurrentEventIndex(
      (prevIndex) =>
        (prevIndex - 1 + featuredEvents.length) % featuredEvents.length
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6 pt-10">
      <div className="flex items-center space-x-4 mb-2">
        <h1 className="text-2xl font-bold text-white">Events</h1>
        <span className="text-emerald-400 ">Upcoming</span>
      </div>

      <Card className="bg-gradient-to-r from-[#151c1c] to-[#33cf95] rounded-xl mb-4 relative ">
        <div className="flex flex-col gap-2">
          <div className="relative w-full  h-[200px] rounded-lg overflow-hidden">
            <Image
              src={testImage}
              alt="testing"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={prevEvent}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={nextEvent}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </Card>

      {/* dots under photos */}
      <div className="flex justify-center gap-2 mb-4">
        {featuredEvents.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentEventIndex ? "bg-emerald-400" : "bg-gray-600"
            }`}
            onClick={() => setCurrentEventIndex(index)}
          />
        ))}
      </div>

      <div className="flex justify-between mb-8 px-4">
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-lg">
            <Trophy className="w-6 h-6 text-gray-400" />
          </div>
          <span className="text-xs text-gray-400">Sports</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-lg">
            <Music className="w-6 h-6 text-gray-400" />
          </div>
          <span className="text-xs text-gray-400">Cultural</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-lg">
            <GraduationCap className="w-6 h-6 text-gray-400" />
          </div>
          <span className="text-xs text-gray-400">Education</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-lg">
            <Palette className="w-6 h-6 text-gray-400" />
          </div>
          <span className="text-xs text-gray-400">Art</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-lg">
            <Speech className="w-6 h-6 text-gray-400" />
          </div>
          <span className="text-xs text-gray-400">Seminar</span>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">All events</h2>
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </div>
  );
}
