const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));


// Server status
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


    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Song topic is required"
      });
    }


    const apiKey = process.env.GEMINI_API_KEY;


    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured"
      });
    }


    const prompt = `
You are a professional Indian song lyricist.

Create completely original song lyrics.

Song topic/story:
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

- Write original lyrics only.
- Do not copy existing songs.
- Use natural Indian songwriting.
- Keep lines short and easy to sing.
- Maintain a clear emotional flow.
- Use sections:
INTRO
VERSE 1
PRE-CHORUS
CHORUS
VERSE 2
BRIDGE
FINAL CHORUS
OUTRO

If singer is Duet, clearly separate:
MALE:
FEMALE:

Do not add explanations.
Return only the lyrics.
`;


    const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=" +
  
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
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


    const data = await response.json();


    if (!response.ok) {

      console.error("Gemini error:", data);

      return res.status(response.status).json({
        success: false,
        message:
          data?.error?.message ||
          "Gemini API request failed"
      });

    }


    const generatedLyrics =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;


    if (!generatedLyrics) {

      return res.status(500).json({
        success: false,
        message: "No lyrics were generated"
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
