"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import testImage from "@/public/test-carousel.jpg";
import {
  ChevronLeft,
  Heart,
  Trophy,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IEvent } from "@/models/event";

export default function EventPage() {
  const router = useRouter();
  const [event, setEvent] = useState<IEvent>();
  return (
    <div className="flex flex-col px-6 pt-10 space-y-4 bg-[#1a1a1a] min-h-screen">
      <div className="flex flex-row justify-between items-center mb-4">
        <ChevronLeft
          onClick={() => router.back()}
          className="text-white h-8 w-8"
        />
        <Heart className="text-emerald-400 h-8 w-8" />
      </div>
      <Image src={testImage} height={100} width={1000} alt="testing image" />
      <div className="flex flex-col space-y-2">
        <Trophy className="border-[0.23rem] px-2 py-2 border-emerald-400 text-white w-10 h-10 rounded-sm font-bold" />
        <p className="text-white text-2xl font-extrabold">Full stack learn</p>
      </div>
      <p className="text-gray-400">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an u
      </p>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-2">
          <Calendar className="text-emerald-400" />
          <p className="text-white">12/12/2024</p>
        </div>
        <div className="flex flex-row space-x-2">
          <Clock className="text-emerald-400" />
          <p className="text-white">12:00 PM</p>
        </div>
      </div>
      <div className="flex flex-row space-x-2">
        <MapPin className="text-emerald-400" />
        <p className="text-white">12:00 PM</p>
      </div>
      <div className="text-center">
        <Button className="mb-auto rounded-full border-[0.2rem] border-emerald-400 w-[15rem] mt-10 py-5">
          RSVP
        </Button>
      </div>
    </div>
  );
}
