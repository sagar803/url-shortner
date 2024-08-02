"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function RedirectPage({ params }) {
  const router = useRouter();
  const { shortUrl } = params;

  useEffect(() => {
    const redirectToLongUrl = async () => {
      const { data, error } = await supabase
        .from("urls")
        .select("long_url")
        .eq("short_url", shortUrl)
        .single();

      if (error || !data) {
        router.push("/404");
      } else {
        router.push(data.long_url);
      }
    };

    redirectToLongUrl();
  }, [shortUrl, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <p className="text-gray-700">Redirecting...</p>
    </div>
  );
}
