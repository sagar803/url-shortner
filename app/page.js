// import Link from "next/link";

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <Link href="/shorten">Go to URL Shortener</Link>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl }),
      });
      const data = await res.json();
      setShortUrl(`${window.location.origin}/${data.shortUrl}`);
    } catch (error) {
      console.log("error :", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>URL Shortener</CardTitle>
          <CardDescription>Enter a long URL to shorten it</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter your URL"
              required
            />
            <Button type="submit" className="w-full">
              {loading ? "Shortening..." : "Shorten"}
            </Button>
          </form>
          {shortUrl && (
            <div className="mt-4 p-2 border border-gray-300 rounded">
              <p className="text-gray-700">Short URL:</p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {shortUrl}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
