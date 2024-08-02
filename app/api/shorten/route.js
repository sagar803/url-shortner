import { supabase } from "../../../lib/supabaseClient";
import { nanoid } from "nanoid";

// POST method to handle URL shortening
export async function POST(request) {
  try {
    const { longUrl, customId } = await request.json();
    console.log(longUrl, customId);

    // Use customId if provided, otherwise generate a random one
    const shortId = customId || nanoid(6);

    // Check if the shortId already exists
    const { data: existingUrl, error: existingError } = await supabase
      .from("urls")
      .select("short_url")
      .eq("short_url", shortId)
      .single();

    // if (existingError) {
    //   return new Response(
    //     JSON.stringify({ error: "Database error. Please try again." }),
    //     {
    //       status: 500,
    //     }
    //   );
    // }

    if (existingUrl) {
      return new Response(
        JSON.stringify({ error: "ID already exists. Please try another one." }),
        {
          status: 400,
        }
      );
    }

    // Insert the new short URL into the database
    const { data, error } = await supabase
      .from("urls")
      .insert([{ long_url: longUrl, short_url: shortId }])
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to shorten URL. Please try again." }),
        {
          status: 500,
        }
      );
    }

    return new Response(JSON.stringify({ shortUrl: shortId }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid request. Please check your input." }),
      {
        status: 400,
      }
    );
  }
}
