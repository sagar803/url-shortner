import { supabase } from "@/lib/supabaseClient";
import { nanoid } from "nanoid";

export const POST = async (req) => {
  const { longUrl } = await req.json();

  if (!longUrl) {
    return new Response(JSON.stringify({ error: "URL is required" }), {
      status: 400,
    });
  }

  const shortUrl = nanoid(6);

  console.log("Short URL: " + shortUrl);
  console.log("Long URL: " + longUrl);

  const { data, error } = await supabase
    .from("urls")
    .insert([{ long_url: longUrl, short_url: shortUrl }])
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  console.log("URL inserted successfully: " + JSON.stringify(data));
  return new Response(JSON.stringify({ shortUrl }), {
    status: 200,
  });
};
