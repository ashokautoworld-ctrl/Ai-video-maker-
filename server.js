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


// AI Lyrics Generator
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
You are an expert Indian Bollywood songwriter and lyricist.

Create completely original, emotionally powerful, natural-sounding song lyrics based on the user's story.

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


SONGWRITING STYLE:

- Write completely original lyrics.
- Do not copy or imitate any existing copyrighted song.
- Make the lyrics feel like a professionally written Indian Bollywood song.
- Keep every line short, clear and easy to sing.
- Maintain a smooth emotional flow from one line to the next.
- Avoid awkward, unnatural or overly complicated sentences.
- Use simple but beautiful Hindi/Urdu/Marathi vocabulary according to the selected language.
- Make the emotions feel genuine and relatable.
- Do not overuse the same word or phrase.
- Create a memorable and catchy main hook.
- The CHORUS should be the strongest and most memorable part.
- The lyrics should be suitable for AI music generation and singing.
- Avoid excessive poetry that sounds like a written poem instead of a song.


SONG STRUCTURE:

INTRO

VERSE 1

PRE-CHORUS

CHORUS

VERSE 2

BRIDGE

FINAL CHORUS

OUTRO


IMPORTANT:

- Keep each line relatively short.
- Do not make lines unnecessarily long.
- Make the chorus emotionally stronger than the verses.
- Repeat the main hook naturally in the chorus.
- Keep the story consistent throughout the song.
- Do not suddenly change the story or emotion.
- Do not add explanations before or after the lyrics.
- Do not include music production instructions.
- Return only the finished lyrics.


SINGER RULE:

If Singer is Male:
Write for one male singer.

If Singer is Female:
Write for one female singer.

If Singer is Duet:
Clearly separate the singers using:

[MALE]
[FEMALE]

Do not mix or overlap their lines.


LANGUAGE RULE:

Use only the selected language for the lyrics.
Do not randomly mix English words unless they are naturally necessary.


FINAL OUTPUT:

Return only the complete song lyrics with section labels.
`;
`;


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


    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (error) {

      console.error(
        "Gemini raw response:",
        responseText
      );

      return res.status(500).json({
        success: false,
        message: "Gemini returned an invalid response"
      });

    }


    if (!response.ok) {

      console.error(
        "Gemini API error:",
        data
      );

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
        message: "Gemini did not return lyrics"
      });

    }


    res.json({
      success: true,
      lyrics: generatedLyrics
    });


  } catch (error) {

    console.error(
      "Lyrics generation error:",
      error
    );

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
