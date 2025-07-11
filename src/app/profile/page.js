"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ProfileContent() {
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
      <Link href="/" className="text-blue-600 underline">Back to Home</Link>
      <h2 className="text-lg font-semibold mt-4">Count History</h2>
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          Loading history...
        </div>
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

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          Loading profile...
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
} 