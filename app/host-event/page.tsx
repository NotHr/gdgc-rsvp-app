"use client";

import { z } from "zod";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const clubs = [
  { id: 1, name: "GDGC" },
  { id: 2, name: "Github club" },
  { id: 3, name: "Kalakriti" },
  { id: 4, name: "Cogaan" },
  { id: 5, name: "G-electra" },
];

const categories = [
  { id: 1, name: "Sports" },
  { id: 2, name: "Educational" },
  { id: 3, name: "Cultural" },
  { id: 4, name: "Art" },
  { id: 5, name: "Unlisted" },
];

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  organizer: z.string().min(1, "Organizer is required"),
  category: z.string().min(1, "Category is required"),
  eventPoster: z.any().refine((file) => file instanceof File, {
    message: "Event poster is required",
  }),
});

export default function HostEventForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    category: "",
    eventPoster: null as File | null,
  });

  const [posterPreview, setPosterPreview] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPosterPreview(previewUrl);
      setFormData((prev) => ({ ...prev, eventPoster: file }));
    }
  };

  const handleSubmit = () => {
    try {
      eventSchema.parse(formData);
      console.log("Submitted data:", formData);
      setErrors({});
    } catch (err: any) {
      const fieldErrors: Record<string, string> = {};
      if (err.errors) {
        err.errors.forEach((error: any) => {
          fieldErrors[error.path[0]] = error.message;
        });
      }
      setErrors(fieldErrors);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6 pb-20">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold">Host Event</h1>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-lg">
              Title
            </label>
            <Input
              id="title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={handleInputChange}
              className="bg-transparent border border-[#33cf96] rounded-lg text-white placeholder:text-gray-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-lg">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter event description"
              value={formData.description}
              onChange={handleInputChange}
              className="bg-transparent border border-[#33cf96] rounded-lg text-white placeholder:text-gray-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="block text-lg">
                Date
              </label>
              <Input
                type="date"
                id="date"
                value={formData.date}
                onChange={handleInputChange}
                className="bg-transparent border border-[#33cf96] rounded-lg text-white placeholder:text-gray-500"
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="time" className="block text-lg">
                Time
              </label>
              <Input
                type="time"
                id="time"
                value={formData.time}
                onChange={handleInputChange}
                className="bg-transparent border border-[#33cf96] rounded-lg text-white placeholder:text-gray-500"
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-lg">
              Location
            </label>
            <Input
              id="location"
              placeholder="Enter the location of the event"
              value={formData.location}
              onChange={handleInputChange}
              className="bg-transparent border border-[#33cf96] rounded-lg text-white placeholder:text-gray-500"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-lg">Club</label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("organizer", value)
                }
              >
                <SelectTrigger className="bg-transparent border border-[#33cf96] rounded-lg text-white">
                  <SelectValue placeholder="Select club" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.name}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.organizer && (
                <p className="text-red-500 text-sm">{errors.organizer}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Category</label>
              <Select
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="bg-transparent border border-[#33cf96] rounded-lg text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg">Event Poster</label>
            <div
              className="cursor-pointer flex justify-center items-center rounded-lg border border-[#33cf96] bg-transparent h-40"
              onClick={() => document.getElementById("posterInput")?.click()}
            >
              {posterPreview ? (
                <img
                  src={posterPreview}
                  alt="Poster Preview"
                  className="h-full w-auto"
                />
              ) : (
                <Upload size={24} color="white" />
              )}
            </div>
            <input
              id="posterInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePosterChange}
            />
          </div>

          <Button
            variant="default"
            className="bg-[#33cf96] w-full py-3 text-black font-semibold"
            onClick={handleSubmit}
          >
            Host Event
          </Button>
        </div>
      </div>
    </div>
  );
}
