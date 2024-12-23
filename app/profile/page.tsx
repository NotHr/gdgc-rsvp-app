"use client";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
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
      } catch (err: any) {
        setError(err.message);
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
