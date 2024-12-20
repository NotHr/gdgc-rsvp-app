"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const events = [
  {
    id: 1,
    title: "Diwali Festival Event",
    date: "12/01/24",
    startTime: "10:30",
    endTime: "12:00",
    venue: "Shivaji Auditorium",
  },
];

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function CalendarView() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(1);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(1);
  };

  const dates = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDayOfMonth + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const isDateSelected = (date: number | null) => {
    if (!date) return false;
    return (
      date === selectedDate &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isDateDisabled = (date: number | null) => {
    if (!date) return true;
    const dateObj = new Date(currentYear, currentMonth, date);
    return dateObj < today;
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-semibold mb-6">Calendar</h1>

        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-[#00FF85] hover:bg-transparent"
            onClick={prevMonth}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span className="text-xl">{`${monthName} ${currentYear}`}</span>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-[#00FF85] hover:bg-transparent"
            onClick={nextMonth}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => (
              <div key={day} className="text-center text-sm text-[#00FF85]">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {dates.map((date, index) => (
              <div key={index} className="aspect-square">
                <Button
                  variant="ghost"
                  disabled={isDateDisabled(date)}
                  className={cn(
                    "h-full w-full rounded-full",
                    "disabled:opacity-50 disabled:bg-[#333] disabled:hover:bg-[#333]",
                    "hover:bg-[#00FF85]/10 hover:text-white",
                    isDateSelected(date) &&
                      "bg-[#00FF85] text-black hover:bg-[#00FF85] font-semibold",
                    date === null && "invisible pointer-events-none"
                  )}
                  onClick={() =>
                    date && !isDateDisabled(date) && setSelectedDate(date)
                  }
                >
                  {date}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 mt-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#002611] rounded-lg p-4 space-y-1"
            >
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-[#00FF85] fill-current" />
                <span className="text-[#00FF85]">
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              <h3 className="text-lg font-medium">{event.title}</h3>
              <p className="text-[#00FF85]/60">{event.venue}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
