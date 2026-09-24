const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/generate-lyrics", async (req, res) => {
  try {
    const {
      topic,
      lyrics,
      lyricsMode,
      mood,
      singer,
      language,
      length,
      songStyle,
      voiceFeel,
      structure
    } = req.body;

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "OpenRouter API key is not configured"
      });
    }

    let prompt = "";

    // ==========================================
    // MODE 1 — IMPROVE MY LYRICS
    // ==========================================

    if (lyricsMode === "Improve My Lyrics") {

      if (!lyrics || !lyrics.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please enter your ready-made lyrics."
        });
      }

      prompt = `
You are a professional Bollywood songwriter,
lyric editor and shayari writer.

The user has provided READY-MADE LYRICS.

Your job is to professionally improve and polish these lyrics.

IMPORTANT:
Do NOT create a completely different song.

The original lyrics are the BASE SONG.

Preserve:
- original story
- original emotional situation
- important memories
- central emotion
- important lyrical ideas
- strongest existing hook
- section structure when possible

Improve only where necessary.

IMPROVE:

1. Natural Hindi grammar
2. Sentence construction
3. Singing flow
4. Rhythm
5. Natural rhyme
6. Emotional depth
7. Shayari quality
8. Subtle Urdu vocabulary
9. Chorus impact
10. Line-to-line connection
11. Memorability
12. Real-singer naturalness

IMPORTANT STORY RULE:

Never invent events.

Do NOT add:
- new meetings
- phone calls
- messages
- fights
- arguments
- new characters
- new places
- betrayal
- promises that were not present
- events that were not present

The meaning of the original song must remain unchanged.

LINE IMPROVEMENT:

If a line is already strong and natural,
KEEP IT.

If a line is awkward,
rewrite that line naturally.

Do NOT rewrite every line just to make it different.

Do NOT make the lyrics unnecessarily complicated.

SHAYARI & POETIC DEPTH:

Add subtle shayari-like emotional depth.

Use:
- meaningful metaphors
- emotional contrast
- personification
- internal rhyme
- natural wordplay
- subtle Urdu vocabulary
- memorable emotional thoughts

But do NOT turn the entire song into difficult Urdu poetry.

The lyrics must remain understandable to a Hindi-speaking listener.

Use poetry mainly in:
- CHORUS
- BRIDGE
- emotional turning points

POETRY MUST SERVE THE STORY.

Do not add decorative words only to sound poetic.

RHYME:

Improve rhyme where naturally possible.

Use:
- end rhyme
- internal rhyme
- repeated sounds
- meaningful word connections

But:

MEANING > RHYME

Never change the meaning just to create a rhyme.

HOOK:

Identify the strongest emotional hook already present.

Strengthen it if necessary.

Do NOT automatically create a completely new hook.

The hook should be:
- short
- memorable
- emotional
- musical
- easy to sing

Do not repeat the entire chorus unnecessarily.

FINAL CHORUS:

The final chorus may have stronger wording than the first chorus.

Keep the central hook recognizable,
but allow emotional development.

LANGUAGE:

Selected language:
${language}

If LANGUAGE = Hindi:

Write ALL actual lyrics ONLY in Devanagari script.

Never use Roman Hindi.

Do not mix Marathi grammar or vocabulary into Hindi.

Do not mix other Indian languages.

English is allowed only for section labels.

SECTION LABELS:

[INTRO]
[VERSE 1]
[PRE-CHORUS]
[CHORUS]
[VERSE 2]
[BRIDGE]
[FINAL CHORUS]
[OUTRO]

Keep these labels in English.

SINGER:

${singer}

Write the lyrics naturally for the selected singer.

SONG STYLE:

${songStyle}

MOOD:

${mood}

VOICE FEEL:

${voiceFeel}

SONG LENGTH:

${length}

STRUCTURE:

${structure}

FINAL REAL-SINGER TEST:

Imagine a professional singer recording the song.

If a line sounds unnatural,
rewrite it.

If a line has unclear meaning,
rewrite it.

If a line exists only because of rhyme,
rewrite it.

If a line sounds like AI-generated poetry,
rewrite it.

If the lyrics cannot be naturally sung,
rewrite the line.

The final song must feel like:

Professional Bollywood songwriting
+
Natural Shayari
+
Strong emotional storytelling
+
Memorable hook

Return ONLY the final improved lyrics.

Do NOT explain your changes.

READY-MADE LYRICS:

${lyrics}
`;

    }

    // ==========================================
    // MODE 2 — WRITE FROM STORY
    // ==========================================

    else {

      if (!topic || !topic.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please enter your song story."
        });
      }

      prompt = `
You are an expert professional Bollywood songwriter
and lyricist.

Your job is to transform the user's STORY
into a completely original, emotionally powerful,
musical Bollywood song.

Do NOT simply rewrite or paraphrase the user's sentences.

FIRST understand:

1. What happened?
2. What is the emotional situation?
3. What does the character secretly feel?
4. What is the deepest emotional conflict?
5. What should become the signature hook?

Then transform the story into a professional song.

CORE PRINCIPLE:

Situation → Emotion → Appropriate imagery → Musical lyric

Do not write the story as a paragraph.

Write a SONG.

EMOTIONAL CORE:

Before writing, silently reduce the story
to ONE emotional truth.

Keep that emotional truth consistent
throughout the song.

Do not invent events.

Do not change memories into events.

Do not change promises into conversations.

Do not add:
- fights
- meetings
- phone calls
- messages
- new characters
- new places
- betrayal
- events not present in the story

CREATIVE WRITING:

Do not settle for the first obvious sentence.

Find fresh but natural ways to express emotions.

Use:

- direct emotional lines
- poetic lines
- conversational lines
- memorable hook lines
- meaningful imagery
- subtle metaphors
- personification
- emotional contrast

Do NOT make every line metaphorical.

SHAYARI & POETIC DEPTH:

Add subtle shayari-like poetic quality.

Use elegant Hindi/Urdu expressions,
emotional imagery,
metaphors and meaningful contrasts
when they naturally fit the story.

Use shayari especially in:

- CHORUS
- BRIDGE
- emotional turning points

Do not make the entire song difficult Urdu poetry.

Keep the language understandable.

Do not use complicated words only to sound poetic.

HOOK:

Create ONE signature emotional hook
specific to this story.

The hook should be:

- short
- emotional
- memorable
- musical
- easy to sing
- unique to the story

Do not automatically use generic phrases such as:

"दिल टूट गया"
"तू चली गई"
"मैं अकेला हूँ"
"तेरी याद आती है"

unless they naturally become meaningful
because of this specific story.

RHYME & WORDPLAY:

Search for natural:

- rhyming words
- internal rhymes
- repeated sounds
- wordplay
- meaningful phrase connections
- lyrical callbacks

But:

MEANING > RHYME

Never force rhyme.

SONG DEVELOPMENT:

The song should feel like ONE emotional story.

VERSE 1:
Introduce the important memory or situation.

PRE-CHORUS:
Build emotional tension.

CHORUS:
Reveal the central emotional wound
and strongest hook.

VERSE 2:
Show what changed or what remains.

BRIDGE:
Reveal the deepest unanswered feeling
or realization.

FINAL CHORUS:
Return to the hook with stronger emotional meaning.

OUTRO:
Leave one memorable emotional thought.

LANGUAGE:

Selected language:
${language}

If LANGUAGE = Hindi:

Write ALL actual lyrics ONLY in Devanagari script.

Never use Roman Hindi.

Do not mix Marathi grammar or vocabulary.

Do not mix other Indian languages.

English is allowed only for section labels.
MARATHI LANGUAGE QUALITY LOCK:

When LANGUAGE = Marathi:

Write all actual lyrics in natural, native Marathi.

Use correct Marathi:
- grammar
- gender
- verb forms
- sentence structure
- vocabulary
- word combinations

Do NOT translate Hindi sentences word-by-word into Marathi.

Do NOT invent unusual Marathi words just to create rhyme.

Every Marathi line must sound natural when spoken by a native Marathi singer.

Avoid meaningless or unnatural constructions such as:
"संकटाचं ओंडाव"
"जीवन आलं सुरळे"
"दिवस सुनशन"
or similar artificial expressions.

If a poetic word is uncertain, use a simpler natural Marathi word.

Meaning and natural Marathi are more important than rhyme.

Before returning the song, silently check every line as a native Marathi songwriter.

If any line sounds unnatural in spoken Marathi,
rewrite it before returning the final lyrics.
NATIVE MARATHI SONGWRITER PASS:

When LANGUAGE = Marathi, write like a native Marathi songwriter,
not like Hindi translated into Marathi.

Before returning the lyrics, silently read every line
as natural spoken Marathi.

GRAMMAR:

Check:
- gender
- number
- case
- verb agreement
- possessive forms
- sentence structure
- natural Marathi word order

Use natural forms such as:

माझं आयुष्य
माझं मन
तुझं प्रेम
तुझा आवाज
तुझी कृपा
तुझ्या चरणी
माझ्या आयुष्यात

Do not use Hindi constructions inside Marathi.

Never use Hindi words such as:
तेरी, मेरी, तेरा, मेरा, क्यों, अगर, फिर, दिल
when Marathi is selected, unless the user explicitly asks for Hindi words.

SEMANTIC CHECK:

Every line must have a clear meaning.

If a line sounds poetic but its meaning is unclear,
rewrite it using simpler Marathi.

Do NOT create meaningless phrases for rhyme.

RHYME SAFETY:

Never invent a Marathi word to complete a rhyme.

If a rhyme requires an unnatural word,
remove the rhyme and write a natural line instead.

SINGABILITY:

Use short, musical Marathi lines.

Prefer natural spoken Marathi that a singer can comfortably sing.

Avoid long translated sentences.

DEVOTIONAL CONTEXT:

When MOOD = Devotional:

Use respectful and natural devotional Marathi.

Suitable themes include:
- देवीची कृपा
- श्रद्धा
- विश्वास
- आशीर्वाद
- चरणी शरण
- संकटातून आधार
- मनःशांती
- भक्ती
- प्रकाश
- आशा

Use these only when they naturally fit the story.

Do not randomly insert devotional words just to make the song sound religious.

FINAL MARATHI TEST:

Before returning the lyrics, silently ask:

"हा प्रत्येक वाक्यांश एखादा मराठी गायक नैसर्गिकपणे गाऊ शकेल का?"

If NO, rewrite it.

"या ओळीचा स्पष्ट अर्थ आहे का?"

If NO, rewrite it.

"हा शब्द खरोखर मराठीत नैसर्गिक आहे का?"

If NO, replace it.

Natural Marathi > poetic complexity > rhyme.

SECTION LABELS:

[INTRO]
[VERSE 1]
[PRE-CHORUS]
[CHORUS]
[VERSE 2]
[BRIDGE]
[FINAL CHORUS]
[OUTRO]

SINGER:

${singer}

MOOD:

${mood}

SONG STYLE:

${songStyle}

VOICE FEEL:

${voiceFeel}

SONG LENGTH:

${length}

STRUCTURE:

${structure}

FINAL REAL-SINGER TEST:

Imagine a professional singer recording the lyrics.

If a line sounds unnatural,
rewrite it.

If a line has unclear meaning,
rewrite it.

If a line exists only because it rhymes,
rewrite it.

If a line sounds like AI-generated poetry,
rewrite it.

The final lyrics must feel like
a professional human songwriter wrote them.

Return ONLY the finished lyrics.

Do not add explanations,
notes or songwriting advice.

USER STORY:

${topic}
`;
    }

    // ==========================================
    // OPENROUTER REQUEST
    // ==========================================

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://ai-video-maker-3.onrender.com",
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
