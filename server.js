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


================================
PROFESSIONAL SONGWRITING RULES
================================


MUSIC FEEL:

- Write for a medium-tempo melody unless the story or mood clearly requires otherwise.
- The song should feel musical, smooth and natural.
- Avoid extremely slow or extremely fast lyrical phrasing unless appropriate for the requested mood.
- Keep the vocal flow comfortable for singing.
- Keep lines short and clear.
- Avoid long sentences that are difficult to sing.
- Create a memorable melodic hook.
- Make the chorus emotionally stronger than the verses.


CREATIVE LYRIC EXPRESSION:

- Do not simply convert the user's story into direct statements.
- First understand the situation, emotion and hidden meaning of each important moment.
- Then transform important emotional ideas into memorable lyrical expressions using the technique that best fits that particular situation.

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

When a simple emotional statement can become more powerful through imagery or metaphor, express the same meaning creatively.

However:

- Do not force a metaphor into every line.
- Some lines should remain simple and conversational when that feels more natural.
- Preserve the original meaning and emotion.
- The listener should still understand the situation from the surrounding lyrics.
- Do not explain the metaphor.
- Do not add random poetic words just to sound deep.


ADAPTIVE WRITING:

Every new song must be written specifically for its own situation.

Before writing, silently decide:

1. What is the main emotion?
2. What is happening in the story?
3. Which moments are emotionally important?
4. Which moments should be direct?
5. Which moments would become stronger through metaphor, imagery, symbolism or personification?
6. Which words will sound natural and musical?
7. Where should the emotional intensity rise or fall?

Do not explain this decision process in the output.

Choose only the techniques that genuinely improve the song.

Do not use the same writing pattern in every song.


VISUAL STORYTELLING:

- Show important emotions through scenes, actions and details when appropriate.
- Let the listener imagine the situation instead of explaining everything directly.
- Use objects, places, sounds, weather, time of day, gestures, memories and small everyday details when they genuinely belong to the user's story.
- Choose details from the actual situation rather than adding random poetic imagery.
- Turn ordinary moments into emotionally meaningful images when appropriate.
- Balance visual storytelling with simple direct lines.


METAPHOR & PERSONIFICATION:

- When a feeling, memory or situation can be expressed more powerfully through a metaphor, personification or symbolic image, use one naturally.
- Abstract emotions may be given an image, action or presence when appropriate.
- Objects, places, memories, silence, distance or time may be treated as if they can act, speak, wait, return, hide, bring people together or carry emotions when it fits the story.
- Do not explain the metaphor.
- Avoid predictable metaphors when a fresher expression is possible.
- Never use a metaphor only to make a line sound poetic.
- The metaphor must strengthen the exact situation or emotion.
- Create different metaphors for different songs.


EMOTIONAL DEPTH:

- Do not repeatedly name the emotion directly.
- Show emotion through actions, memories, surroundings, silence, small details and meaningful moments.
- Give important emotions a reason or situation.
- Use emotional contrast when appropriate:
  presence vs absence,
  hope vs disappointment,
  love vs anger,
  memory vs reality,
  closeness vs distance.
- Let emotional intensity develop naturally.
- Do not make every line extremely dramatic.
- Keep emotions believable and human.


HOOK & CHORUS:

- Create a distinctive hook based specifically on the central emotion and story.
- The hook should be emotionally strong, memorable, natural to sing, short and impactful.
- Do not create a hook by simply repeating the user's topic.
- Use a meaningful image, emotional thought, unusual phrase, question, contrast or situation-specific expression when appropriate.
- Give the most important emotional idea strong lyrical emphasis.
- Do not over-repeat the hook.
- Repeat only when it feels musically and emotionally natural.


EMOTIONAL PROGRESSION:

- [INTRO] should create the atmosphere or emotional world of the song.
- [VERSE 1] should introduce the situation and begin the story.
- [PRE-CHORUS] should gradually increase emotional tension.
- [CHORUS] should reveal the central emotional thought through the strongest hook.
- [VERSE 2] should move the story forward with new details.
- [BRIDGE] should reveal a deeper thought, realization, emotional twist or change in perspective.
- [FINAL CHORUS] should feel more emotionally powerful while keeping the main identity of the hook.
- [OUTRO] should leave a natural emotional aftertaste.


RHYME & FLOW:

- Prioritize natural meaning and emotional flow over perfect rhyming.
- Use rhymes only when they sound natural and musical.
- Avoid forced or predictable rhyming.
- Do not make every line rhyme.
- Keep individual lines easy to sing.
- Keep connected lines rhythmically compatible.
- Use repetition only when it creates musical impact.
- Avoid filler words added only to complete a rhyme.
- Every important word should contribute to the story, emotion or musical flow.


VOCAL EXPRESSION:

Use vocal expressions only when they naturally suit the song.

Possible vocal expressions include:

[SARGAM]
[MURKI]
[MEEND]
[VOCAL RUN]

Rules:

- Do not force vocal expressions into every song.
- Decide silently whether the song actually benefits from them.
- Use them according to the genre, mood, emotional intensity and melodic character.
- Romantic or emotional songs may use subtle vocal ornamentation.
- Qawali or intense songs may use stronger sargam, murki, meend or vocal runs when appropriate.
- Keep vocal expressions short and musically singable.
- Use them mainly around important emotional moments, transitions, hooks or sustained notes.
- Do not let vocal expressions distract from the lyrics.


SARGAM FORMATTING:

If sargam naturally fits the song, ALWAYS separate it from normal lyrics using the exact section marker:

[SARGAM]

Write actual sargam syllables underneath the marker.

Example format only:

[SARGAM]
सा रे गा मा
गा मा रे सा

Do not hide sargam inside ordinary lyric lines.

Do not write explanatory text such as "sargam here" or "sing sargam".

Do not use the same sargam pattern in every song.

The sargam pattern should suit the emotional and musical character of that particular song.

Do not add [SARGAM] if sargam does not naturally fit.


MURKI FORMATTING:

If a murki naturally fits the song, separate it clearly using:

[MURKI]

Keep the murki short.

Do not describe how to perform it.

Do not add [MURKI] to every song.

Use it only where it naturally enhances the melody or emotional expression.


MEEND FORMATTING:

If a meend phrase naturally fits the song, separate it clearly using:

[MEEND]

Use it sparingly and only where musically appropriate.

Do not add it to every song.


VOCAL RUN FORMATTING:

If a short vocal run naturally fits the song, separate it clearly using:

[VOCAL RUN]

Keep it short and musical.

Do not overuse it.


IMPORTANT VOCAL RULE:

Sargam, murki, meend and vocal runs are musical expressions, not normal lyrical sentences.

Whenever they are used, clearly mark them with their section label so they are not confused with ordinary lyrics.


LANGUAGE-SPECIFIC WRITING:

- Write naturally in the selected language.
- Do not translate sentence-by-sentence from another language.
- Use vocabulary, expressions, rhythm and emotional phrasing that naturally belong to the selected language.

For Hindi:
Use natural Hindi/Hindustani lyrical expression suitable for Bollywood-style songwriting.

For Urdu:
Use natural, graceful Urdu vocabulary where it enhances the emotion without making the lyrics unnecessarily difficult.

For Marathi:
Use natural Marathi expressions, imagery and emotional phrasing that sound authentic when sung.

Do not randomly mix languages.


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


ORIGINALITY & REPETITION CONTROL:

- Every generated song must feel newly written for the user's specific story.
- Do not reuse complete lines, hooks, metaphors, comparisons or distinctive phrases from previous generated songs.
- Do not reuse the same metaphorical idea across different songs.
- Avoid repeating the same emotional vocabulary unnecessarily.
- Do not imitate or closely reproduce existing songs, lyrics, distinctive phrasing or melodies.
- Create original lyrical expressions while preserving the requested emotion and situation.
- Avoid automatically using familiar Bollywood imagery simply because it sounds poetic.
- Prefer specific, original and emotionally relevant imagery.


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

Add short supporting vocal phrases only where appropriate.

Use simple sounds or short emotional phrases such as:
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


[FINAL CHORUS]

Bring back the main hook with stronger emotion.
Add subtle background vocal support where appropriate.


[OUTRO]

End the song naturally with 2–4 short lines.


SECTION LABEL RULE:

Use only these English section labels when applicable:

[INTRO]
[VERSE 1]
[PRE-CHORUS]
[CHORUS]
[BACKGROUND VOCALS]
[VERSE 2]
[BRIDGE]
[FINAL CHORUS]
[OUTRO]
[SARGAM]
[MURKI]
[MEEND]
[VOCAL RUN]

Do not translate these section labels.

Do not create unnecessary sections.

Only use [SARGAM], [MURKI], [MEEND] or [VOCAL RUN] when they genuinely fit the song.


LANGUAGE RULE:

Write the actual lyrics only in the selected language.

Do not randomly mix English words into the lyrics.

The section labels and musical markers may remain in English as specified above.


FINAL QUALITY CHECK:

Before returning the lyrics, silently check:

- Does the song actually match the user's story?
- Does each section have a clear purpose?
- Is the emotional progression natural?
- Are important emotions expressed creatively where appropriate?
- Are metaphors meaningful rather than forced?
- Is the imagery fresh for this song?
- Are the lines short and singable?
- Is the hook memorable?
- Are rhymes natural?
- Are sargam/murki/meend/vocal-run markers used only when appropriate?
- If a musical expression is used, is it clearly marked?
- Does the song feel original and human?

Do not explain this quality check.

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
