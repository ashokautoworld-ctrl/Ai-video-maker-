const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "AI Lyrics Maker server is running"
  });
});

app.post("/api/generate-lyrics", async (req, res) => {
  try {
    const {
  topic,
  mood,
  singer,
  language,
  length,
  songStyle,
  voiceFeel
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
You are a professional Indian Bollywood songwriter.

Create completely original song lyrics based on the user's story.

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
SONG STYLE RULE:

- Follow the selected song style naturally.
- Bollywood: cinematic Indian film-song expression.
- Romantic: melodic and intimate romantic expression.
- Acoustic: simple, intimate and conversational.
- Qawali: expressive qawali-style energy where appropriate.
- Sufi: mystical and metaphorical emotional expression without forcing religious language.
- Orchestral: cinematic and emotionally expansive writing.
- High Beat: short, catchy and rhythm-friendly lines.
Write professional, original, musical lyrics.

IMPORTANT:
- Understand the situation and emotion first.
- Do not simply convert the topic into direct sentences.
- Use metaphor, personification, imagery, symbolism or visual storytelling when they genuinely improve the emotion.
- Do not force metaphors into every line.
- Use fresh imagery specific to this story.
- Avoid repeating common Bollywood clichés unnecessarily.
- Keep lines short, clear and easy to sing.
- Create a memorable hook.
- Chorus should be stronger than verses.
- Maintain natural rhyme and flow.
- Do not use random filler words.
- Keep the emotional progression natural.
- Write naturally in the selected language.
- Do not randomly mix languages.

For Hindi:
Use natural Hindi/Hindustani Bollywood songwriting language.

For Urdu:
Use graceful natural Urdu vocabulary.

For Marathi:
Use authentic natural Marathi expressions.

SINGER RULE:
Male = natural male perspective.
Female = natural female perspective.
Duet = clearly separate [MALE] and [FEMALE] sections. Do not overlap their main lines.

SONG STRUCTURE:

[INTRO]

[VERSE 1]

[PRE-CHORUS]

[CHORUS]

[BACKGROUND VOCALS]

[VERSE 2]

[BRIDGE]

[FINAL CHORUS]

[OUTRO]

Use only the sections that genuinely fit.

MUSICAL EXPRESSIONS:

If appropriate, use:
[SARGAM]
[MURKI]
[MEEND]
[VOCAL RUN]

These must be clearly separated from normal lyrics.

Do not force these into every song.

BACKGROUND VOCALS:
Use them only when they naturally enhance the song.
Keep them short and separate from the lead singer.
Do not use the same pattern in every song.

ORIGINALITY:
Every song must feel newly written for this specific story.
Do not copy existing songs, lyrics, melodies or distinctive phrases.

Return ONLY the finished lyrics.
Do not add explanations or notes.
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

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("OpenRouter raw response:", responseText);

      return res.status(500).json({
        success: false,
        message: "OpenRouter returned an invalid response"
      });
    }

    if (!response.ok) {
      console.error("OpenRouter API error:", data);

      return res.status(response.status).json({
        success: false,
        message:
          data?.error?.message ||
          "OpenRouter API request failed"
      });
    }
console.log("OpenRouter response:", JSON.stringify(data));
    const generatedLyrics =
      data?.choices?.[0]?.message?.content;

    if (!generatedLyrics) {
      return res.status(500).json({
        success: false,
        message: "OpenRouter did not return lyrics"
      });
    }

    res.json({
      success: true,
      lyrics: generatedLyrics
    });

  } catch (error) {
    console.error("Lyrics generation error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `🎵 AI Lyrics Maker running on port ${PORT}`
  );
});
