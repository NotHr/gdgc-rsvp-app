"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const clubs = [
  { id: 1, name: "GDGC" },
  { id: 2, name: "Github club" },
  { id: 3, name: "Kalakriti" },
  { id: 4, name: "Cogaan" },
  { id: 5, name: "G-electra" },
] as const;

const categories = [
  { id: 1, name: "Sports" },
  { id: 2, name: "Educational" },
  { id: 3, name: "Cultural" },
  { id: 4, name: "Art" },
  { id: 5, name: "Unlisted" },
] as const;

// Enhanced form schema with better validation
const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate >= today;
  }, "Event date cannot be in the past"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  organizer: z.string().min(1, "Organizer is required"),
  category: z.string().min(1, "Category is required"),
  eventPoster: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB",
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png, and .webp files are accepted",
    ),
});

type FormData = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  eventPoster: File | null;
};

export default function HostEventForm() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    category: "",
    eventPoster: null,
  });
  const [posterPreview, setPosterPreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: keyof FormData, value: any) => {
    try {
      eventSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.errors[0]?.message || "Invalid input",
        }));
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    validateField(id as keyof FormData, value);
  };

  const handleSelectChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    validateField(key as keyof FormData, value);
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous preview URL
      if (posterPreview) {
        URL.revokeObjectURL(posterPreview);
      }

      try {
        eventSchema.shape.eventPoster.parse(file);
        const previewUrl = URL.createObjectURL(file);
        setPosterPreview(previewUrl);
        setFormData((prev) => ({ ...prev, eventPoster: file }));
        setErrors((prev) => ({ ...prev, eventPoster: "" }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({
            ...prev,
            eventPoster: error.errors[0]?.message || "Invalid file",
          }));
        }
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate all form data
      eventSchema.parse(formData);

      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          fd.append(key, value);
        }
      });

      const response = await fetch("/api/events", {
        method: "POST",
        body: fd,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      toast.success("Event created successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        organizer: "",
        category: "",
        eventPoster: null,
      });
      setPosterPreview("");
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error("Please fix the form errors");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6 pb-20">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold">Host Event</h1>
        <div className="space-y-6">
          {/* Title */}
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

          {/* Description */}
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

          {/* Date and Time */}
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

          {/* Location */}
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

          {/* Club and Category */}
          <div className="grid grid-cols-2 gap-4">
            {/* Club */}
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

            {/* Category */}
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

          {/* Event Poster */}
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
            {errors.eventPoster && (
              <p className="text-red-500 text-sm">{errors.eventPoster}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            variant="default"
            className="bg-[#33cf96] w-full py-3 text-black font-semibold"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Hosting..." : "Host Event"}
          </Button>
        </div>
      </div>
    </div>
  );
}
