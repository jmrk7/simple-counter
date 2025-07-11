"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [profileActionLoading, setProfileActionLoading] = useState(false);

  // Fetch all profiles
  useEffect(() => {
    setProfilesLoading(true);
    fetch("/api/profile")
      .then((res) => res.json())
      .then(setProfiles)
      .finally(() => setProfilesLoading(false));
  }, []);

  // Fetch today's count when username changes
  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetch(`/api/count?username=${username}`)
      .then((res) => res.json())
      .then((data) => setCount(data.value || 0))
      .finally(() => setLoading(false));
  }, [username]);

  // Create/select profile
  const handleProfile = async (e) => {
    e.preventDefault();
    if (!newUsername) return;
    setProfileActionLoading(true);
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername }),
    });
    const profile = await res.json();
    setUsername(profile.username);
    setNewUsername("");
    setProfileActionLoading(false);
    // Refresh profiles
    setProfilesLoading(true);
    fetch("/api/profile").then((res) => res.json()).then(setProfiles).finally(() => setProfilesLoading(false));
  };

  // Increment count
  const handleIncrement = async () => {
    setLoading(true);
    const res = await fetch("/api/count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    setCount(data.value);
    setLoading(false);
  };

  // Decrement count
  const handleDecrement = async () => {
    setLoading(true);
    const res = await fetch("/api/count", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    setCount(data.value);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-2xl font-bold">Simple Counter App</h1>
      <form onSubmit={handleProfile} className="flex gap-2">
        <select
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded px-2 py-1"
          disabled={profilesLoading}
        >
          <option value="">
            {profilesLoading ? "Loading profiles..." : "Select profile"}
          </option>
          {profiles.map((p) => (
            <option key={p._id} value={p.username}>
              {p.username}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New profile name"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="border rounded px-2 py-1"
          disabled={profileActionLoading}
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-2"
          disabled={profileActionLoading}
        >
          {profileActionLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating...
            </>
          ) : (
            "Add / Select"
          )}
        </button>
      </form>
      {username && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-lg">Hello, <b>{username}</b>!</div>
          <div className="text-4xl font-mono">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                Loading...
              </div>
            ) : (
              count
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDecrement}
              className="bg-red-500 text-white px-4 py-2 rounded text-lg flex items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              -1
            </button>
            <button
              onClick={handleIncrement}
              className="bg-green-500 text-white px-4 py-2 rounded text-lg flex items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              +1
            </button>
          </div>
          <a
            href={`/profile?username=${username}`}
            className="text-blue-600 underline mt-2"
          >
            View Profile
          </a>
        </div>
      )}
    </div>
  );
}
