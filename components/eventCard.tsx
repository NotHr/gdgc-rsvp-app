"use client";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Music, Clock, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function EventCard({ event }: any) {
  const router = useRouter();
  return (
    <Card className="bg-[#223730] p-4 rounded-xl border-none">
      <div className="flex items-center mb-3">
        <div className="flex flex-row items-center justify-between space-x-2">
          <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center">
            <Music className="w-4 h-4 text-black" />
          </div>
          <span className="text-gray-400">Cultural Event</span>
        </div>
        <Heart className="text-emerald-400 ml-auto" />
      </div>
      <div className="flex justify-between items-center mb-2 text-white">
        <h3 className="font-semibold">{event.title}</h3>
        <div className="flex  gap-2 text-sm text-gray-400">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <span className="text-white w-[4rem] ml-auto">14/12/2024</span>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <span className="text-white">{event.location}</span>
        </div>
        <div className="flex gap-2 text-sm text-gray-400 ">
          <Clock className="w-5 h-5 text-emerald-400" />
          <span className="text-white w-[4rem] ml-auto">10:30 AM</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full bg-transparent border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black"
        onClick={() => router.push(`/event/${event._id}`)}
      >
        View details
      </Button>
    </Card>
  );
}
