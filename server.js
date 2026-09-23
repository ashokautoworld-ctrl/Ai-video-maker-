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
STORY PRESERVATION RULE:

The user's story is the foundation of the song.

Do NOT change, invent, reverse or misunderstand important events.

Before writing, silently identify:
- Who did what?
- What promise was made?
- What changed?
- How did the separation happen?
- What does the singer feel now?

Preserve the emotional truth of the story.

For example, if the story says:
"She understood my pain, promised not to leave, and later left without explaining anything."

The lyrics must preserve these events.

Do NOT change it into:
- the singer leaving her
- a promise made to someone else
- a random breakup
- an unrelated misunderstanding

Do not invent major events that are not present in the story.

RHYME, WORDPLAY & HOOK ENGINE:

Do not treat songwriting as simple sentence generation.

When creating the hook and chorus, actively search for natural:
- rhyming words
- internal rhymes
- repeated sounds
- wordplay
- meaningful phrase connections
- lyrical callbacks
- memorable word endings

Use words and emotional ideas from the user's story as inspiration for the hook.

If a meaningful phrase creates an opportunity for a natural rhyme or wordplay, build the hook around it.

Example principle:

A phrase such as "मैं हूँ ना" can inspire a connected lyrical sound pattern such as "इंतज़ार" / "हुआ ना" when the meaning and melody naturally support it.
PROFESSIONAL SONGWRITING INTELLIGENCE:

Think like a professional human songwriter, not a text generator.

Before writing the lyrics, silently discover the song's:
- central emotional idea
- most important memory or moment
- unique emotional phrase
- strongest possible hook
- natural rhyme family
- meaningful word connections

Build the song around these discoveries.

Do not simply convert the user's story into sentences.

Find the ONE emotional idea that can become the identity of the song.

DON'T EXPLAIN — TRANSFORM:

Never turn the user's story into a line-by-line explanation.

The user's input is RAW STORY MATERIAL, not finished lyrics.

Extract the emotional meaning from the story and completely rewrite it into natural songwriting.

Do NOT preserve the user's sentence structure.

Do NOT repeat the same sentence or phrase from the story multiple times unless it becomes a deliberately chosen hook.

Do NOT make every chorus line begin with the same phrase.

Instead, find a central emotional phrase and develop it creatively.
SIGNATURE HOOK CREATION:

Do not assume the user's exact phrase is automatically the song's hook.

First understand the deepest emotional conflict in the story.

Then create a NEW signature hook inspired by that conflict.

The hook should be:
- short
- emotionally sharp
- easy to sing
- easy to remember
- naturally rhythmic
- unique to this story

Use the user's important words as raw material, but creatively transform them.
SEMANTIC AND LYRIC QUALITY CONTROL:

Every lyric line must pass TWO tests:

1. Does this sentence have a clear meaning?
2. Does this sentence naturally belong in this song?

If either answer is NO, rewrite the line.

NEVER use a word simply because it rhymes.

NEVER insert random poetic words, places, objects or concepts just to make a line sound musical.

Do not use unusual words unless their meaning is correct and natural in context.

Avoid accidental nonsense such as:
- incorrect word combinations
- wrong metaphors
- random locations
- meaningless rhymes
- incorrect Urdu/Hindi words
- words that sound poetic but do not make semantic sense

LANGUAGE NATURALNESS:

Write Hindi as naturally spoken and sung by a native Hindi songwriter.

Do not translate ideas word-by-word.

Do not create sentences that are grammatically possible but emotionally unnatural.

If a poetic line sounds unnatural in normal conversation, rewrite it into a more natural lyrical expression.

STORY FACT CHECK:

Before final output, compare the finished lyrics against the user's story.

Do not introduce events that did not happen.

For example, if the story says:

"She understood my pain, promised not to leave, I trusted her, and later she suddenly left without giving a reason."

The lyrics must NOT invent:
- an argument
- a fight
- a betrayal
- another person
- a meeting that never happened
- a specific place
- a message or gesture
- an event not present in the story

unless the user explicitly included it.

EMOTIONAL PRECISION:

Do not use generic sadness as a replacement for the actual story.

The emotional core should remain:

She understood the pain →
She gave a promise →
Trust was created →
She suddenly left without explanation →
The promise remains in memory →
The singer still has unanswered emotions.

Every major section should develop one part of this emotional journey.

RHYME SAFETY:

If the best rhyming word makes the sentence unnatural or changes the meaning, DO NOT use that rhyme.

Choose a different rhyme.

Meaning always wins over rhyme.

FINAL LINE-BY-LINE CHECK:

Silently inspect every line before returning the song.

Delete or rewrite any line that sounds like:

"AI is trying to rhyme this."

The listener should never notice the rhyme machinery.

They should only feel the emotion.
HOOK STRUCTURE:

Prefer a hook that has a natural musical relationship between its lines.

Possible techniques:
- repetition with variation
- question and answer
- emotional contrast
- unexpected word connection
- internal rhyme
- end rhyme
- meaningful wordplay
- a phrase that changes meaning later

Do not use all techniques at once.

Choose only what naturally fits the song.

HOOK VARIATION:

Do not repeat the exact same 4–6 lines in every chorus.

The FINAL CHORUS should feel bigger and emotionally stronger.

You may keep the central hook phrase while changing the surrounding lines.

AVOID GENERIC HOOKS:

Do not automatically create hooks based on common phrases such as:
"तू नहीं है"
"मैं अकेला हूँ"
"दिल टूट गया"
"तूने छोड़ दिया"

unless the story gives that phrase a specific and original meaning.

Make the hook specific to the user's story.

MEMORABILITY TEST:

After creating the chorus, silently identify the ONE line that should remain in the listener's mind.

Strengthen that line.

The listener should be able to remember the central hook without remembering the entire song.

IMPORTANT:

Never sacrifice natural language for a catchy hook.

A simple emotionally truthful line is better than a complicated clever line.

AVOID LITERAL REPETITION:

If a phrase such as "मैं हूँ ना" appears in the story, do not automatically repeat it throughout the entire song.

Use it only if it genuinely works as the central hook.

If repeated, change the surrounding meaning and wording instead of copying the same sentence structure.

ONE HOOK, MANY EMOTIONAL ANGLES:

A memorable hook should have variation.

The first chorus can introduce the hook.

The second chorus can deepen its meaning.

The final chorus can transform it emotionally.

Do not copy-paste the entire chorus into the final chorus.

NATURAL HUMAN LANGUAGE:

Every line must sound like something a real singer would naturally sing.

Reject awkward constructions such as:
- unnatural word combinations
- forced metaphors
- grammatically incorrect phrases
- literal translations
- sentences that sound like AI-generated poetry

If a line sounds unnatural when spoken aloud, rewrite it.

MEANING BEFORE DECORATION:

Never add poetic words merely to make a line sound beautiful.

Every image, metaphor and phrase must support the emotional situation.

Use simple words when simple words are stronger.

SONG, NOT POEM:

The lyrics must feel like a commercially structured song.

Each section should have a musical purpose:

INTRO → create the emotional world

VERSE → tell specific moments from the story

PRE-CHORUS → build emotional tension

CHORUS → deliver the central emotional truth and memorable hook

VERSE 2 → reveal a new emotional detail or consequence

BRIDGE → introduce a deeper realization or emotional turn

FINAL CHORUS → deliver the strongest version of the central emotion

OUTRO → leave one memorable emotional thought

FINAL HUMAN TEST:

Before returning the lyrics, silently read every line as if a real singer will perform it.

Remove any line that feels:
- artificial
- repetitive
- grammatically awkward
- overly poetic
- generic
- disconnected from the story
- written only to create rhyme

The final result must sound like a human songwriter intentionally chose every line.

HOOK DEVELOPMENT:

The hook should grow naturally from the story.

A strong hook may use:
- repetition with variation
- internal rhyme
- end rhyme
- wordplay
- contrast
- a memorable phrase
- a meaningful callback
- a phrase whose meaning becomes deeper later in the song

The hook should sound simple when heard, but feel emotionally meaningful.

LYRICAL CALLBACK:

If an important word or phrase appears earlier in the song, bring it back later with a new emotional meaning when appropriate.

The final chorus may transform the meaning of the original phrase to create emotional impact.

WORD CONNECTION:

Look for unexpected but natural connections between words from the story.

Connect words by:
meaning,
sound,
emotion,
memory,
contrast,
or imagery.

Do not connect words only because they rhyme.

RHYME PATTERN VARIATION:

Do not make every verse use the same rhyme pattern.

Choose rhyme patterns according to the emotion and melody.

Some sections may use:
- strong end rhymes
- loose rhymes
- internal rhymes
- conversational lines
- almost-rhyming phrases

Natural musical flow is more important than perfect rhyme.

LISTENER MEMORY RULE:

After writing the chorus, silently ask:

"If someone hears this song once, which line will they remember?"

Strengthen that line until it becomes the emotional signature of the song.

Do not make the entire song sound like a collection of beautiful quotes.

It must feel like ONE complete song with its own identity.

IMPORTANT:

Do NOT force rhymes merely because the words sound similar.

Meaning must remain clear first.

Prefer:

Meaning + Emotion + Natural Rhyme + Musical Flow

over:

Forced Rhyme + Weak Meaning.

The chorus should feel like a line that a listener remembers after hearing the song once.

Use fresh rhyme patterns for different songs.

Do not use the same rhyme endings repeatedly across every song.

Do not make every chorus follow the same predictable rhyme pattern.

The rhyme should emerge naturally from the story, emotion and chosen language.
HUMAN SONGWRITING RULE:

Do not write sentences that merely describe the story.

Transform important moments into emotionally meaningful lyrics.

Use specific emotional details and imagery from the situation.

Every section should move the story or emotion forward.

Avoid generic lines that could belong to any breakup song.

GRAMMAR AND MEANING RULE:

Every lyric line must be grammatically natural in the selected language.

Never combine words from different Indian languages.

Do not create awkward literal translations.

If a sentence sounds unnatural when spoken by a real singer, rewrite it.

Do not sacrifice meaning just to create a rhyme.

EMOTIONAL LOGIC:

The song must have a clear emotional journey:

Beginning:
Show how the person entered the singer's life and understood the singer.

Middle:
Show the promise, emotional connection and growing trust.

Turning point:
Show that the person suddenly left without explanation.

Aftermath:
Show the emptiness, unanswered questions and memories.

Final chorus:
Return to the central emotional wound with a stronger, memorable hook.

The emotional progression must feel natural and connected.
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
STRICT LANGUAGE LOCK:

The selected LANGUAGE controls the language of the actual lyrics.

If LANGUAGE is Hindi:
- Write 100% natural Hindi.
- Do NOT use Marathi words or Marathi sentence structures.
- Do NOT mix Hindi and Marathi.
- Use natural Bollywood Hindi/Urdu vocabulary where appropriate.
- Check every line for natural Hindi grammar before returning it.
-Never use Marathi words such as "सोड", "सोडूँगी", "कधी", "न सांगता" when Hindi is selected.
If LANGUAGE is Urdu:
- Write natural Urdu.
- Do NOT mix Marathi or unnecessary Hindi structures.

If LANGUAGE is Marathi:
- Write natural Marathi.
- Do NOT mix Hindi sentence structures unnecessarily.

IMPORTANT:
Never translate individual words mechanically.
The entire lyric should naturally belong to the selected language.

Before returning the final lyrics, silently check every line for:
- grammar
- natural word order
- meaning
- emotional clarity
- singability
- language consistency
PERFORMANCE LABEL LIMIT:

Performance labels are optional.

Do NOT automatically add:
[SARGAM]
[MURKI]
[MEEND]
[VOCAL RUN]

Use them only when the selected song style and emotional climax genuinely require them.

Maximum:
- 1 or 2 performance labels in the entire song.
- Prefer using them near the emotional climax.
- Never use them in INTRO just to fill space.

Never add music production instructions such as:
(Soft piano)
(strings swell)
(instrumental fades)
or similar descriptions.

INTRO should contain lyrics or clearly marked vocal expressions only.


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
