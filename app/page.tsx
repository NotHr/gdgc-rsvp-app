"use client";
import testCarsonal from "@/public/test-carousel.jpg";
import { useState, useEffect } from "react";
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

export default function EventsPage() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();

        // Assuming the structure of response is { message, event: [events] }
        if (data && data.event) {
          setEvents(data.event); // Access 'event' array from the API response
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  const nextEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const prevEvent = () => {
    setCurrentEventIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length,
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6 pt-10">
      <div className="flex items-center space-x-4 mb-2">
        <h1 className="text-2xl font-bold text-white">Events</h1>
        <span className="text-emerald-400">Upcoming</span>
      </div>

      {/* Featured Event Carousel */}
      {events?.length > 0 && (
        <Card className="bg-gradient-to-r from-[#151c1c] to-[#33cf95] rounded-xl mb-4 relative">
          <div className="flex flex-col gap-2">
            <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
              <Image
                src={events[currentEventIndex].image || testCarsonal}
                alt={events[currentEventIndex].title}
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
      )}

      {/* Dots under photos */}
      <div className="flex justify-center gap-2 mb-4">
        {events?.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentEventIndex ? "bg-emerald-400" : "bg-gray-600"
            }`}
            onClick={() => setCurrentEventIndex(index)}
          />
        ))}
      </div>

      {/* Event Categories */}
      <div className="flex justify-between mb-8 px-4">
        {[
          { Icon: Trophy, label: "Sports" },
          { Icon: Music, label: "Cultural" },
          { Icon: GraduationCap, label: "Education" },
          { Icon: Palette, label: "Art" },
          { Icon: Speech, label: "Seminar" },
        ].map(({ Icon, label }, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-lg">
              <Icon className="w-6 h-6 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {/* All Events Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">All events</h2>
        {events?.length ? (
          events?.map((event, index) => <EventCard key={index} event={event} />)
        ) : (
          <div className="justify-center">No events available.</div>
        )}
      </div>
    </div>
  );
}
