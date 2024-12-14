"use client";
import { Home, Calendar, CirclePlus, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.includes("/login") || pathname.includes("/register")) {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-6 py-2 bg-[#151c1c] z-50">
      <Home onClick={() => router.push("/")} className="text-[#33cf95]" />
      <Calendar
        onClick={() => router.push("/calender")}
        className="text-[#33cf95]"
      />
      <CirclePlus
        className="size-11 text-[#33cf95]"
        onClick={() => router.push("/host-event")}
      />
      <Heart
        onClick={() => router.push("/wishlist")}
        className="text-[#33cf95]"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#33cf95"
        className="size-7"
        onClick={() => router.push("/profile")}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </footer>
  );
}
