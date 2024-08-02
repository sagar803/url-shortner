'use client'

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clipboard, Check } from "lucide-react";

const MatrixBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] bg-black">
      <div className="w-full h-full overflow-hidden">
        {[...Array(200)].map((_, i) => (
          <span
            key={i}
            className="text-green-500 text-opacity-75 absolute"
            style={{
              fontSize: `${12 + Math.random() * 12}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `fall ${10 + Math.random() * 20}s linear infinite`,
            }}
          >
            {String.fromCharCode(33 + Math.floor(Math.random() * 94))}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [customId, setCustomId] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);  // Reset after 2 seconds
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
      setError("URL taken, please retry.");
      return;
    }

    const data = await res.json();
    setShortUrl(`${window.location.origin}/${data.shortUrl}`);
    setError("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <MatrixBackground />
      <Card className="max-w-md w-full bg-white backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-4">
          <img
            src="./dlogo.png"
            alt="Logo Creator"
            className="w-16 h-16 object-contain"
          />
          <CardTitle className="text-2xl font-bold">
            URL Shortener
          </CardTitle>
        </div>
          <CardDescription className="text-gray-700">Enter a long URL to shorten it</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter your URL"
              required
              className="bg-white/70"
            />
            <div className="flex space-x-2 items-center">
              <span className="text-gray-600">link.bionicdiamond.com/</span>
              <Input
                type="text"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                placeholder="custom text"
                className="flex-grow bg-white/70"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              Shorten
            </Button>
          </form>
          {shortUrl && (
            <div className="mt-4 p-2 border border-green-300 rounded flex justify-between items-center bg-white/70">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline"
              >
                {shortUrl}
              </a>
              <Button
                type="button"
                onClick={copyToClipboard}
                variant="ghost"
                size="icon"
                className="text-green-600"
              >
                {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}