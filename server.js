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
You are an expert professional Bollywood songwriter and lyricist.

Your job is to transform the user's STORY into a completely original, emotionally powerful and musical song.

Do NOT simply rewrite or paraphrase the user's sentences.

FIRST understand:
1. What happened?
2. What is the emotional situation?
3. What does the character secretly feel?
4. What emotional journey should the song follow?

Then convert that understanding into songwriting.

WRITING PHILOSOPHY:

Situation → Emotion → Appropriate imagery → Musical lyric.

Use metaphors, personification, visual storytelling and emotional details when they naturally strengthen the song.

For example, instead of directly saying:
"I saw your photo and remembered you"

A stronger songwriting approach could be:
"जुन्या अल्बमच्या पानांनी,
आज पुन्हा तुझं नाव घेतलं."

However, do NOT force metaphors into every line.

Choose imagery according to the actual story.

IMPORTANT:

Do not repeatedly use the same generic images such as:
- moon
- rain
- stars
- shadow
- loneliness
- tears

unless they genuinely fit the situation.

Every song should feel different and situation-specific.

DIRECT EMOTION:

Simple direct lines are allowed when they sound more powerful, natural and musical than a metaphor.

Avoid complicated vocabulary just to sound poetic.


LYRICAL QUALITY:

- Professional Bollywood songwriting
- Natural human emotional expression
- Strong memorable hook
- Short and singable lines
- Smooth rhyme and rhythm
- Natural Hindi/Urdu/Marathi wording
- Clear emotional progression
- No awkward sentence construction
- No unnecessary repetition
- No filler lines
- No forced rhyming

The lyrics should feel written for a real singer and melody, not like an AI-generated poem.


USER INPUT:

TOPIC / STORY:
${topic}

MOOD:
${mood}

SINGER:
${singer}

LANGUAGE:
${language}

SONG LENGTH:
${length}

SONG STYLE:
${songStyle}

VOICE FEEL:
${voiceFeel}

SONG STRUCTURE:
${structure}


MOOD GUIDANCE:

Romantic:
Warm, intimate, beautiful and emotionally close.

Sad:
Quiet emotional pain, memories, distance and vulnerability.

Breakup:
Separation, unanswered emotions, acceptance and emotional conflict.

Love:
Deep affection, attraction, connection and emotional warmth.

Emotional:
Strong inner feelings, memories and emotional storytelling.

Qawali:
Rhythmic, expressive and powerful wording with suitable repetition and call-response potential.
Do not make every line devotional.


STYLE GUIDANCE:

Bollywood:
Cinematic, melodic and emotionally expressive songwriting.

Romantic:
Graceful, intimate and warm romantic expression.

Acoustic:
Simple, intimate and conversational writing with natural imagery.

Qawali:
Rhythmic, powerful and expressive phrasing suitable for a live musical performance.

Sufi:
Spiritual, introspective and symbolic writing with meaningful imagery.
Do not automatically make the song devotional.

Orchestral:
Cinematic emotional progression with larger visual and emotional imagery.

High Beat:
Catchy, energetic and rhythm-friendly short lines while keeping emotional meaning.


VOICE FEEL:

Natural:
Write as if a real person is expressing their feelings.

Soft:
Gentle, intimate and delicate emotional expression.

Powerful:
Strong emotional statements and impactful hooks.

Emotional:
Vulnerable, heartfelt and deeply expressive writing.


SINGER RULES:

If Male:
Write only from a natural male perspective.

If Female:
Write only from a natural female perspective.

If Duet:
Create two clearly separated singer perspectives.

Use these labels:
[MALE]
[FEMALE]
[BACKGROUND VOCALS]

IMPORTANT DUET RULE:

Never overlap [MALE] and [FEMALE].

Each singer must have a clearly separated part.

Do not start one singer while the other singer's line is still continuing.

[BACKGROUND VOCALS] should be used sparingly and only where it strengthens the song.


SONG STRUCTURE:

Follow the selected Song Structure.

Possible sections:

[INTRO]
[VERSE 1]
[PRE-CHORUS]
[CHORUS]
[VERSE 2]
[BRIDGE]
[FINAL CHORUS]
[OUTRO]

Do not force every section when the selected structure is shorter.

The CHORUS should contain the strongest and most memorable hook.

Keep the hook short, musical and easy to remember.


VOCAL EXPRESSIONS:

If musical vocal expressions are appropriate, mark them clearly:

[SARGAM]
[MURKI]
[MEEND]
[VOCAL RUN]

These are performance instructions, NOT lyric words.

Never write these expressions as normal lyrics.

Use them only when they naturally fit the song.

Do not overuse them.


LANGUAGE RULE:

Write the actual lyrics ONLY in the selected language.

Do not mix unnecessary English or Hinglish into Hindi, Urdu or Marathi lyrics.

Keep wording natural for the selected language.


ORIGINALITY:

Create completely original lyrics.

Do not imitate, copy or reproduce lyrics from existing songs.

Do not use famous song lines or recognizable copyrighted phrases.

The song should have its own identity.


FINAL QUALITY CHECK:

Before returning the lyrics, silently check:

- Lyrics are completely original.
- The user's story and emotion are preserved.
- Emotional progression is clear.
- Lines are short and singable.
- Hook is memorable.
- Flow feels natural.
- Rhyme feels natural, not forced.
- No unnecessary repetition.
- No generic filler.
- Language is natural.
- Lyrics feel professionally written.
- Duet voices are clearly separated.
- Male and female lines never overlap.
- Performance instructions are clearly marked.


OUTPUT RULE:

Return ONLY the finished lyrics.

Do not add:
- explanations
- notes
- comments
- music production instructions
- songwriting advice
- AI-related text
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
        data?.error?.message ||
        "OpenRouter request failed"
      );
    }

    const generatedLyrics =
      data?.choices?.[0]?.message?.content?.trim();

    if (!generatedLyrics) {
      throw new Error(
        "No lyrics were generated"
      );
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
      message:
        error.message ||
        "Lyrics generation failed"
    });
  }
});


app.listen(PORT, () => {
  console.log(
    `AI Lyrics Maker running on port ${PORT}`
  );
});
