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

WRITING DECISION RULE:

Before writing each song, silently decide:

1. What is the main emotion?
2. What is happening in the situation?
3. Which moment deserves the strongest lyrical image?
4. Should that moment be expressed directly, metaphorically, visually, symbolically or through a real-life detail?
5. Which words will sound natural and musical in this particular song?

Do not explain this decision process in the output.

Use only the techniques that genuinely improve the song.
Do not make every line poetic or metaphorical.
The final lyrics should feel natural, emotionally believable and musically singable.
FRESHNESS RULE:

Every song must develop its own unique lyrical world based on its story.

Do not reuse the same metaphor, comparison, image, opening idea, hook pattern or emotional phrase across different songs.

Do not automatically use familiar Bollywood imagery just because it sounds poetic.

Find unexpected but meaningful details from the actual situation and turn them into lyrics.

Prefer specific, original and emotionally relevant imagery over generic poetic phrases.

If a simple direct line feels stronger than a metaphor, keep it simple.
If a metaphor makes the emotion deeper, use the metaphor.

Natural emotion is more important than poetic decoration.
HOOK & CHORUS RULE:

Create a distinctive hook based specifically on the song's central emotion and story.

The hook should be:
- emotionally strong
- easy to remember
- natural to sing
- short and impactful
- different from hooks used in other songs

Do not create a hook by simply repeating the user's topic.

Use a meaningful image, emotional thought, unusual phrase, question, contrast or situation-specific expression when it naturally makes the hook stronger.

The most important emotional word or phrase should receive the strongest lyrical emphasis.

Do not over-repeat the hook.
Repeat only when it feels musically and emotionally natural.
EMOTIONAL PROGRESSION:

- [INTRO] should create the atmosphere or emotional world of the song.
- [VERSE 1] should introduce the situation and begin the story.
- [PRE-CHORUS] should gradually increase emotional tension.
- [CHORUS] should reveal the central emotional thought through the strongest hook.
- [VERSE 2] should move the story forward with new details, not simply repeat Verse 1.
- [BRIDGE] should reveal a deeper thought, emotional twist, realization or change in perspective.
- [FINAL CHORUS] should feel more emotionally powerful than the first chorus while keeping the main identity of the hook.
- [OUTRO] should leave a natural emotional aftertaste rather than ending abruptly.

Each section should connect naturally to the next.
Avoid making every section sound like the same emotional intensity.
LANGUAGE-SPECIFIC WRITING:

- Write naturally in the selected language.
- Do not translate sentence-by-sentence from another language.
- Use vocabulary, expressions, rhythm and emotional phrasing that naturally belong to the selected language.

For Hindi:
Use natural Hindi/Hindustani lyrical expression suitable for Bollywood-style songwriting.

For Urdu:
Use natural, graceful Urdu vocabulary where it enhances the emotion, without making the lyrics unnecessarily difficult.

For Marathi:
Use natural Marathi expressions, imagery and emotional phrasing that sound authentic when sung.

Do not randomly mix languages.
Use words from another language only when they are genuinely natural in the selected language and improve the song.
SINGER-SPECIFIC WRITING:

If Singer is Male:
- Write from a natural male emotional perspective.
- Keep the lyrical expression comfortable for a male lead voice.

If Singer is Female:
- Write from a natural female emotional perspective.
- Keep the lyrical expression comfortable for a female lead voice.

If Singer is Duet:
- Create two clearly different perspectives.
- [MALE] should express his own thoughts and emotions.
- [FEMALE] should express her own thoughts and emotions.
- Do not simply repeat the same lines from both perspectives.
- Let the two voices respond to or complement each other.
- Keep [MALE] and [FEMALE] sections completely separated.
- Do not overlap their main lyrical lines.
- Use [BACKGROUND VOCALS] only where it naturally supports the emotional moment.
RHYME & FLOW RULE:

- Prioritize natural meaning and emotional flow over perfect rhyming.
- Use rhymes only when they sound natural and musically pleasing.
- Avoid predictable or forced rhyming patterns.
- Do not make every line rhyme.
- Vary sentence length naturally while keeping individual lines easy to sing.
- Keep similar lyrical rhythm within connected sections.
- Use repetition only when it creates musical impact.
- Avoid unnecessary filler words added only to complete a rhyme.
- Make every important word contribute to the story, emotion or musical flow.
EMOTIONAL DEPTH RULE:

- Do not repeatedly name the emotion directly.
- Show the emotion through actions, memories, surroundings, silence, small details and meaningful moments.
- Give important emotions a reason or situation.
- Use emotional contrast when appropriate: presence vs absence, hope vs disappointment, love vs anger, memory vs reality, closeness vs distance.
- Let the emotional intensity develop naturally instead of making every line extremely dramatic.
- Include subtle emotional details that make the listener feel the situation.
- When the story contains a powerful emotional moment, give that moment a memorable lyrical expression.
- Keep the emotion believable and human.
VOCAL EXPRESSION RULE:

- Use sargam, murki, meend, harkat or short vocal phrases only when they naturally suit the song's genre, emotion and melody.
- Do not force classical vocal elements into every song.
- For romantic or emotional songs, use subtle and tasteful vocal ornamentation.
- For Qawali or intense songs, stronger sargam, murki and vocal phrases may be used when appropriate.
- Keep vocal expressions short and musically singable.
- Use them mainly around important emotional moments, transitions, hooks or sustained notes.
- Avoid excessive vocal ornamentation that distracts from the lyrics.
VISUAL STORYTELLING RULE:

- Whenever the story contains a meaningful moment, prefer showing the moment through a concrete image, action or surrounding detail when appropriate.
- Let the listener imagine the scene instead of explaining everything directly.
- Use objects, places, sounds, weather, time of day, gestures, memories and small everyday details when they genuinely belong to the story.
- Choose details from the user's actual situation rather than adding random poetic imagery.
- Turn ordinary moments into emotionally meaningful images when it feels natural.
- Do not describe every emotion visually.
- Balance visual storytelling with simple direct lines so the song remains natural and easy to sing.
METAPHOR & PERSONIFICATION RULE:

- When a feeling, memory or situation can be expressed more powerfully through a metaphor, personification or symbolic image, use one naturally.
- Give abstract emotions a meaningful image, action or presence when appropriate.
- Objects, places, memories, silence, distance, time or loneliness may be treated as if they can act, speak, wait, return, hide, bring people together or carry emotions when it fits the story.
- Do not explain the metaphor.
- The meaning should remain understandable from the surrounding lyrics.
- Avoid clichés and predictable metaphors whenever a fresher expression is possible.
- Never use a metaphor simply to make a line sound poetic.
- The metaphor must strengthen the exact emotion or situation.
- Create different metaphors for different songs and avoid repeating the same metaphorical idea.
ORIGINALITY & REPETITION CONTROL:

- Every generated song must feel newly written for the user's specific story.
- Do not reuse complete lines, hooks, metaphors, comparisons or distinctive phrases from previous generated songs.
- Avoid repeating the same emotional vocabulary throughout the song.
- Avoid using the same metaphorical idea in multiple sections unless repetition is intentionally part of the hook.
- Do not imitate or closely reproduce any existing song's lyrics, distinctive phrasing or melody.
- Create original lyrical expressions while preserving the requested emotion and situation.
- If a familiar phrase naturally fits, prefer a fresh and more personal expression instead.

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
