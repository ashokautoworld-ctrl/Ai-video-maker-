const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/generate-lyrics", async (req, res) => {
  try {
    const {
      topic,
      mood,
      singer,
      language,
      length,
      songStyle,
      voiceFeel,
      structure
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Song topic is required"
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "OpenRouter API key is not configured"
      });
    }

    const prompt = `
You are a professional Bollywood songwriter and lyricist.

Write completely original song lyrics based on the user's story.

IMPORTANT WRITING APPROACH:
Do not simply paraphrase the user's story.

First understand the situation and emotion.
Then transform that emotion into natural, musical songwriting.

Use:
- meaningful imagery
- metaphors
- personification
- visual storytelling
- emotional details
- situation-specific expressions

Do not use the same generic metaphors in every song.
Avoid automatically repeating moon, rain, stars, shadow, loneliness, etc.
Choose imagery that fits the actual story.

Direct emotional lines are allowed when they sound stronger and more natural.

LYRIC STYLE:
- Bollywood song feeling
- emotionally expressive
- natural human songwriting
- memorable hook
- short and clear lines
- smooth rhyme and flow
- easy to sing
- medium-tempo melodic feel
- strong emotional progression
- avoid awkward or overly complicated sentences

TOPIC:
${topic}

MOOD:
${mood}

SINGER:
${singer}

LANGUAGE:
${language}

LENGTH:
${length}

SONG STYLE:
${songStyle}

VOICE FEEL:
${voiceFeel}

SONG STRUCTURE:
${structure}

STYLE GUIDANCE:

Adapt the lyrics to the selected Song Style.

Bollywood:
Use cinematic, melodic and emotionally expressive songwriting.

Romantic:
Use intimate, graceful and warm romantic expression.

Acoustic:
Use simple, intimate and conversational lyrics with natural imagery.

Qawali:
Use rhythmic, powerful and expressive phrasing with call-and-response potential where appropriate.

Sufi:
Use spiritual, introspective and symbolic expression with meaningful imagery and emotional depth.
Do not make every Sufi song devotional.

Orchestral:
Use cinematic emotional progression and imagery suitable for a larger melodic arrangement.

High Beat:
Use energetic, catchy and rhythm-friendly short lines while keeping the lyrics meaningful.

Adapt the writing to the selected Voice Feel without changing the story.

SINGER RULES:

If Male:
Write from a natural male perspective.

If Female:
Write from a natural female perspective.

If Duet:
Clearly separate voices using:
[MALE]
[FEMALE]
[BACKGROUND VOCALS]

Do not overlap male and female lines.
Give each singer a clear separate part.

SONG STRUCTURE:

Use appropriate sections such as:

[INTRO]
[VERSE 1]
[PRE-CHORUS]
[CHORUS]
[VERSE 2]
[BRIDGE]
[FINAL CHORUS]
[OUTRO]

Do not force every section if the selected structure is shorter.

If using musical vocal expressions, clearly mark them as:
[SARGAM]
[MURKI]
[MEEND]
[VOCAL RUN]

Do not write these expressions as normal lyric words.

QUALITY CHECK BEFORE FINAL OUTPUT:

Make sure:
- Lyrics are original.
- Story and emotion are preserved.
- Lines are short and singable.
- Hook is memorable.
- Flow feels natural.
- No unnecessary repetition.
- No generic filler.
- Language is natural.
- Lyrics feel like a professionally written song.

Return ONLY the finished lyrics.
Do not add explanations, notes, comments, music production instructions, or AI-related text.
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://ai-video-maker.onrender.com",
          "X-Title": "AI Lyrics Maker"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error?.message || "OpenRouter request failed"
      );
    }

    const generatedLyrics =
      data?.choices?.[0]?.message?.content?.trim();

    if (!generatedLyrics) {
      throw new Error("No lyrics were generated");
    }

    res.json({
      success: true,
      lyrics: generatedLyrics
    });

  } catch (error) {
    console.error("Lyrics generation error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Lyrics generation failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI Lyrics Maker running on port ${PORT}`);
});
