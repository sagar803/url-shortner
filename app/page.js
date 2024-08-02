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
  const [customId, setCustomId] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const generateRandomId = () => {
    const randomId = Math.random().toString(36).substring(2, 8);
    setCustomId(randomId);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ longUrl, customId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.error);
      return;
    }

    const data = await res.json();
    setShortUrl(`${window.location.origin}/${data.shortUrl}`);
    setError("");
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
            <div className="flex space-x-2">
              <Input
                type="text"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                placeholder="Custom ID (optional)"
              />
              <Button type="button" onClick={generateRandomId}>
                Generate Random ID
              </Button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              Shorten
            </Button>
          </form>
          {shortUrl && (
            <div className="mt-4 p-2 border border-gray-300 rounded">
              <p className="text-gray-700">Short URL:</p>
              <div className="flex justify-between items-center">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {shortUrl}
                </a>
                <Button type="button" onClick={copyToClipboard}>
                  Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
