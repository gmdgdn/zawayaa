import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/runtime.ts" // Declare Deno variable

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface PlayHTResponse {
  id: string
  status: string
  output?: {
    url: string
  }
}

interface ArticleTranslation {
  id: string
  article_id: string
  language: string
  title: string
  content: string
  audio_url?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    )

    const { record } = (await req.json()) as { record: ArticleTranslation }

    console.log("Processing TTS generation for:", record.id)

    // Skip if audio_url already exists
    if (record.audio_url) {
      console.log("Audio URL already exists, skipping TTS generation")
      return new Response(JSON.stringify({ message: "Audio already exists" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Prepare text for TTS (combine title and content)
    const textToConvert = `${record.title}. ${record.content}`

    // Limit text length (PlayHT has character limits)
    const maxLength = 500000 // 500k characters
    const finalText = textToConvert.length > maxLength ? textToConvert.substring(0, maxLength) + "..." : textToConvert

    // Select voice based on language
    const voice =
      record.language === "ar"
        ? "ar-XA-Wavenet-A" // Arabic voice
        : "en-US-Wavenet-D" // English voice

    console.log(`Generating TTS for ${record.language} content, ${finalText.length} characters`)

    // Create TTS generation record
    const { data: ttsRecord, error: ttsError } = await supabaseClient
      .from("tts_generations")
      .insert({
        article_translation_id: record.id,
        article_id: record.article_id,
        language: record.language,
        audio_url: "", // Will be updated when generation completes
        character_count: finalText.length,
        voice_used: voice,
        status: "processing",
      })
      .select()
      .single()

    if (ttsError) {
      console.error("Error creating TTS record:", ttsError)
      throw ttsError
    }

    // Call PlayHT API
    const playHTResponse = await fetch("https://api.play.ht/api/v2/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("PLAYHT_API_KEY")}`,
        "X-User-ID": Deno.env.get("PLAYHT_USER_ID") ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: finalText,
        voice: voice,
        quality: "premium",
        output_format: "mp3",
        sample_rate: 24000,
        speed: 1.0,
        seed: null,
      }),
    })

    if (!playHTResponse.ok) {
      const errorText = await playHTResponse.text()
      console.error("PlayHT API error:", errorText)
      throw new Error(`PlayHT API error: ${playHTResponse.status} ${errorText}`)
    }

    const playHTData: PlayHTResponse = await playHTResponse.json()
    console.log("PlayHT job created:", playHTData.id)

    // Poll for completion (with timeout)
    const maxAttempts = 30 // 5 minutes max (10 seconds * 30)
    let attempts = 0
    let audioUrl = ""

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 10000)) // Wait 10 seconds
      attempts++

      const statusResponse = await fetch(`https://api.play.ht/api/v2/tts/${playHTData.id}`, {
        headers: {
          Authorization: `Bearer ${Deno.env.get("PLAYHT_API_KEY")}`,
          "X-User-ID": Deno.env.get("PLAYHT_USER_ID") ?? "",
        },
      })

      if (statusResponse.ok) {
        const statusData: PlayHTResponse = await statusResponse.json()
        console.log(`Attempt ${attempts}: Status ${statusData.status}`)

        if (statusData.status === "completed" && statusData.output?.url) {
          audioUrl = statusData.output.url
          break
        } else if (statusData.status === "failed") {
          throw new Error("PlayHT generation failed")
        }
      }
    }

    if (!audioUrl) {
      throw new Error("TTS generation timed out")
    }

    console.log("TTS generation completed:", audioUrl)

    // Update article translation with audio URL
    const { error: updateError } = await supabaseClient
      .from("article_translations")
      .update({
        audio_url: audioUrl,
        audio_duration: Math.ceil(finalText.length / 15), // Rough estimate: 15 chars per second
      })
      .eq("id", record.id)

    if (updateError) {
      console.error("Error updating article translation:", updateError)
      throw updateError
    }

    // Update TTS generation record
    const { error: ttsUpdateError } = await supabaseClient
      .from("tts_generations")
      .update({
        audio_url: audioUrl,
        status: "completed",
        generation_duration: attempts * 10, // Approximate duration in seconds
      })
      .eq("id", ttsRecord.id)

    if (ttsUpdateError) {
      console.error("Error updating TTS record:", ttsUpdateError)
    }

    console.log("TTS generation process completed successfully")

    return new Response(
      JSON.stringify({
        success: true,
        audio_url: audioUrl,
        character_count: finalText.length,
        generation_time: attempts * 10,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error("TTS generation error:", error)

    return new Response(
      JSON.stringify({
        error: error.message,
        details: "TTS generation failed",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  }
})
