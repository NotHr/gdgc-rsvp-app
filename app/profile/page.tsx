"use client";
import { useEffect, useState } from "react";

interface IUser {
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  role: "student" | "admin" | "faculty";
  createdAt: Date;
}

export default function Profile() {
  const [user, setUser] = useState<IUser | null>(null); // Updated to IUser | null
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/profile-info", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch user details");
        }

        const data = await response.json();
        setUser(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="text-white">
      <h1>Profile</h1>
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>No user data found</p>
      )}
    </div>
  );
}
