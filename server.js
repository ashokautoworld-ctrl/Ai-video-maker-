const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));


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


    // ===============================
    // SONGWRITING PROMPT
    // ===============================

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


MUSIC FEEL:

- Write for a medium-tempo melody.
- The song should feel musical, smooth and natural.
- Avoid extremely slow or extremely fast lyrical phrasing.
- Keep the vocal flow comfortable for singing.
- Keep lines short and clear.
- Avoid long sentences that are difficult to sing.
- Create a memorable melodic hook.
- Use tasteful sargam and murki phrases where they naturally fit the song's melody and emotion.
- Make the chorus emotionally stronger than the verses.


LYRICAL STYLE:

- Write completely original lyrics.
- Do not copy existing songs.
- Make it feel like a professionally written Bollywood song.
- Use simple, natural and beautiful language.
- Keep the story consistent from beginning to end.
- Avoid awkward rhymes.
- Use natural rhymes only when they improve the song.
- Make the lyrics sound like a SONG, not like a poem.
- Create a strong emotional hook.
- Keep the lyrics suitable for AI music generation.
CREATIVE LYRIC EXPRESSION:

Do not simply convert the user's story into direct statements.

First understand the situation, emotion and hidden meaning of each moment.
Then transform important emotional statements into memorable lyrical expressions using the technique that best fits that particular situation.

Possible techniques include:
- Metaphor
- Personification
- Simile
- Visual imagery
- Symbolism
- Nature imagery
- Indirect emotional expression
- Real-life details
- Contrast
- Wordplay

For example:

Simple idea:
"I saw your photo and remembered you."

Instead of writing the idea literally, transform it into a fresh lyrical image such as:
"जुन्या अल्बमच्या पानांनी, तुझं नाव पुन्हा घेतलं."

This is only an example. Never reuse this exact line or its metaphor in another song.
- Use tasteful sargam and murki phrases where they naturally fit the song's melody and emotion.
IMPORTANT:

- Choose the technique according to the specific situation.
- Do not force a metaphor into every line.
- Some lines should remain simple and conversational when that feels more natural.
- Use metaphor or imagery mainly where it makes the emotion deeper or more memorable.
- Do not repeatedly use the same common images such as moon, rain, stars, darkness, shadows or loneliness unless they genuinely belong to the story.
- Create fresh and situation-specific imagery for every new song.
- Preserve the original meaning and emotion while making the expression more lyrical.
- The result should feel like a professional songwriter interpreted the situation creatively, not like AI simply paraphrased the user's words.

SONG STRUCTURE:

[INTRO]

2–4 short lines.


[VERSE 1]

Start the story naturally.


[PRE-CHORUS]

Build emotional tension toward the chorus.


[CHORUS]

Create the main memorable hook.
Keep the lines short and catchy.


[BACKGROUND VOCALS]

Add short supporting vocal phrases.
Use simple sounds or short emotional phrases.
Examples can include:
"oo..."
"aa..."
"oh..."
"haan..."
Use them sparingly.


[VERSE 2]

Continue the story with new details.
Do not simply repeat Verse 1.


[BRIDGE]

Create a deeper emotional moment.
Change the lyrical intensity slightly.


[FINAL CHORUS]

Bring back the main hook with stronger emotion.
Add subtle background vocal support where appropriate.


[OUTRO]

End the song naturally with 2–4 short lines.


SINGER RULE:

If Singer is Male:
Write for one male lead singer.

If Singer is Female:
Write for one female lead singer.

If Singer is Duet:

[MALE]
short lines

[FEMALE]
short lines

[BACKGROUND VOCALS]
short supporting lines

Keep male and female parts clearly separated.
Do not overlap their main lines.


SECTION LABEL RULE:

Always use these section labels in English:

[INTRO]
[VERSE 1]
[PRE-CHORUS]
[CHORUS]
[BACKGROUND VOCALS]
[VERSE 2]
[BRIDGE]
[FINAL CHORUS]
[OUTRO]

Do not translate the section labels.


LANGUAGE RULE:

Write the actual lyrics only in the selected language.

Do not randomly mix English words into the lyrics.


IMPORTANT:

- Do not add explanations.
- Do not add notes.
- Do not add music production instructions.
- Do not mention AI.
- Return only the finished lyrics.
`;



    // ===============================
    // GEMINI API
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
        message:
          "Gemini returned an invalid response"
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
        message:
          "Gemini did not return lyrics"
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


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

  console.log(
    `🎵 AI Lyrics Maker running on port ${PORT}`
  );

});
