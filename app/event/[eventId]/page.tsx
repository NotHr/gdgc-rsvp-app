"use client";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Heart,
  Trophy,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IEvent } from "@/models/event";
import { toast } from "sonner";

export default function EventPage() {
  const router = useRouter();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [isRsvped, setIsRsvped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch event data and RSVP status on load
  useEffect(() => {
    const fetchEventAndRsvpStatus = async () => {
      const eventId = window.location.pathname.split("/").pop();
      if (eventId) {
        try {
          // Fetch event details
          const eventResponse = await fetch(`/api/events/${eventId}`);
          const { event } = await eventResponse.json();
          setEvent(event || null);

          // Check RSVP status
          const rsvpResponse = await fetch(
            `/api/events/rsvp?eventId=${eventId}`
          );
          const { isRsvped } = await rsvpResponse.json();
          setIsRsvped(isRsvped);
        } catch (error) {
          console.error("Failed to fetch event or RSVP status:", error);
          toast.error("Failed to load event details");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEventAndRsvpStatus();
  }, []);

  // Handle RSVP action
  const handleRsvp = async () => {
    if (!event) return;
    try {
      const response = await fetch(`/api/revents/svp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: event._id }),
      });
      const { message } = await response.json();
      if (response.ok) {
        toast.success("RSVP successful!");
        setIsRsvped(true);
      } else {
        toast.error(message || "Failed to RSVP");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("RSVP Error:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="flex flex-col px-6 pt-10 space-y-4 bg-[#1a1a1a] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <ChevronLeft
          onClick={() => router.back()}
          className="text-white h-8 w-8 cursor-pointer"
        />
        <Heart className="text-emerald-400 h-8 w-8 cursor-pointer" />
      </div>
      {/* Event Category */}
      <div className="flex flex-col mt-4">
        <Trophy className="border-[0.23rem] px-2 py-2 border-emerald-400 text-white w-10 h-10 rounded-sm font-bold" />
        <p className="text-white text-2xl font-extrabold">{event.title}</p>
      </div>
      {/* Event Description */}
      <p className="text-gray-400 mt-2">{event.description}</p>
      {/* Event Date, Time, and Location */}
      <div className="flex flex-col space-y-4 mt-6">
        <div className="flex items-center space-x-2">
          <Calendar className="text-emerald-400" />
          <p className="text-white">
            {new Date(event.date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="text-emerald-400" />
          <p className="text-white">
            {new Date(event.date).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="text-emerald-400" />
          <p className="text-white">{event.location}</p>
        </div>
      </div>
      {/* RSVP Button */}
      <div className="text-center mt-10">
        <Button
          className="mb-auto rounded-full border-[0.2rem] border-emerald-400 w-[15rem] py-5"
          onClick={handleRsvp}
          disabled={isRsvped}
        >
          {isRsvped ? "RSVP'd" : "RSVP"}
        </Button>
      </div>
    </div>
  );
}
