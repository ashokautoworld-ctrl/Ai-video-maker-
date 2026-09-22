const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


// ===============================
// BASIC SERVER SETUP
// ===============================

app.use(express.json());

app.use(
  express.static(
    path.join(__dirname)
  )
);


// ===============================
// SERVER STATUS
// ===============================

app.get("/api/status", (req, res) => {

  res.json({
    success: true,
    message: "AI Lyrics Maker server is running"
  });

});


// ===============================
// AI LYRICS GENERATOR
// ===============================

app.post("/api/generate-lyrics", async (req, res) => {

  try {

    const {
      topic,
      mood,
      singer,
      language,
      length
    } = req.body;


    // Check topic

    if (!topic) {

      return res.status(400).json({
        success: false,
        message: "Song topic is required"
      });

    }


    // Get API key

    const apiKey =
      process.env.GEMINI_API_KEY;


    if (!apiKey) {

      return res.status(500).json({
        success: false,
        message:
          "Gemini API key is not configured"
      });

    }


    // ===============================
    // AI PROMPT
    // ===============================

    const prompt = `
You are a professional Indian Bollywood songwriter.

Create completely original song lyrics.

Topic:
${topic}

Mood:
${mood}

Singer:
${singer}

Language:
${language}

Length:
${length}


Requirements:

- Write completely original lyrics.
- Do not copy existing songs.
- Keep every line short and easy to sing.
- Use natural and emotional language.
- Maintain a smooth Bollywood song flow.
- Create a catchy and memorable chorus.
- Keep the story consistent.
- Avoid unnecessarily long sentences.
- Use the selected language.
- If Singer is Duet, clearly separate [MALE] and [FEMALE].
- Do not overlap male and female lines.

Structure:

INTRO
VERSE 1
PRE-CHORUS
CHORUS
VERSE 2
BRIDGE
FINAL CHORUS
OUTRO

Return only the lyrics.
`;


    // ===============================
    // GEMINI API REQUEST
    // ===============================

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },

        body: JSON.stringify({

          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]

        })

      }
    );


    // Read Gemini response

    const responseText =
      await response.text();


    let data;


    try {

      data =
        JSON.parse(responseText);

    }

    catch (error) {

      console.error(
        "Gemini raw response:",
        responseText
      );

      return res.status(500).json({

        success: false,

        message:
          "Gemini returned an invalid response"

      });

    }


    // ===============================
    // API ERROR
    // ===============================

    if (!response.ok) {

      console.error(
        "Gemini API error:",
        data
      );


      return res.status(
        response.status
      ).json({

        success: false,

        message:
          data?.error?.message ||
          "Gemini API request failed"

      });

    }


    // ===============================
    // GET GENERATED LYRICS
    // ===============================

    const generatedLyrics =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;


    if (!generatedLyrics) {

      return res.status(500).json({

        success: false,

        message:
          "Gemini did not return lyrics"

      });

    }


    // ===============================
    // SUCCESS
    // ===============================

    res.json({

      success: true,

      lyrics:
        generatedLyrics

    });


  }

  catch (error) {

    console.error(
      "Lyrics generation error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

});


// ===============================
// START SERVER
// ===============================

app.listen(
  PORT,
  () => {

    console.log(
      `🎵 AI Lyrics Maker running on port ${PORT}`
    );

  }
);
