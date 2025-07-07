"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetch(`/api/count/history?username=${username}`)
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .finally(() => setLoading(false));
  }, [username]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-2xl font-bold">Profile: {username}</h1>
      <a href="/" className="text-blue-600 underline">Back to Home</a>
      <h2 className="text-lg font-semibold mt-4">Count History</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="border mt-2">
          <thead>
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Count</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 && (
              <tr><td colSpan={2} className="text-center">No data</td></tr>
            )}
            {history.map((item) => (
              <tr key={item._id}>
                <td className="border px-2 py-1">{new Date(item.date).toLocaleDateString()}</td>
                <td className="border px-2 py-1">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 