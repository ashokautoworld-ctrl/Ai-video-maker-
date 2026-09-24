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
HINDI NATIVE LANGUAGE HARD LOCK:

When LANGUAGE = Hindi:

Write all actual lyrics in natural native Hindi only.

Use ONLY:
- natural Hindi grammar
- natural Hindi sentence structure
- Hindi/Urdu vocabulary commonly used in Bollywood songs

Do NOT use Marathi grammar, Marathi sentence structure,
or Marathi possessive forms.

Never use Marathi forms such as:
माझं, माझी, माझा
तुझं, तुझी, तुझा
तुमचं, तुमची, तुमचा
तुम्हाकडे, तुझ्याविना

Use their natural Hindi equivalents instead:
मेरा, मेरी, मेरे
तुम्हारा, तुम्हारी, तुम्हारे
तुम्हें, तुमसे, तुम्हारे साथ
तुम्हारे बिना

IMPORTANT:
Do not translate Marathi grammar word-by-word into Hindi.

Before returning the lyrics, scan EVERY lyric line.

If any line sounds like Marathi translated into Hindi,
rewrite the COMPLETE line in natural Hindi.

HINDI NATIVE SPEAKER TEST:

Imagine a native Hindi-speaking Bollywood songwriter reading every line.

If the line sounds unnatural in Hindi,
rewrite it before returning the final lyrics.

Natural Hindi > rhyme.
Natural Hindi > poetic complexity.
Meaning > rhyme.
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
MARATHI GRAMMAR CORRECTION:

Before returning the song, actively check common Marathi agreement errors.

Correct:
माझा → masculine nouns
माझी → feminine nouns
माझं → neuter nouns

तुझा / तुझी / तुझं
तुमचा / तुमची / तुमचं

आव्हान मोठं
आयुष्य बदललं
मन शांत झालं
कृपा झाली
आशा निर्माण झाली

Use correct Marathi verb forms:

मी उभा राहिलो
ती उभी राहिली
मी जाईन
ती येईल
मी धरून ठेवीन

Never use a Hindi grammatical structure translated into Marathi.

If a sentence requires complex grammar,
rewrite it into a simpler natural Marathi sentence.

IMPORTANT:

Do not return a line merely because its words are individually Marathi.

The COMPLETE SENTENCE must sound naturally Marathi.

A line that is grammatically correct but unnatural in spoken Marathi
must still be rewritten.

FINAL RULE:

When in doubt between:
1. poetic but unnatural Marathi
2. simple and natural Marathi

ALWAYS choose simple and natural Marathi.

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
DEVOTIONAL SONG STYLE:

When MOOD = Devotional AND LANGUAGE = Marathi:

Create a genuine devotional Marathi song.

The central feeling should be:
श्रद्धा + विश्वास + शरणागती + कृपा + मनःशांती

Use devotional imagery naturally:
चरणी शरण जाणे, कृपा, आशीर्वाद, भक्ती,
नामस्मरण, आधार, श्रद्धा, मनःशांती.

Do not force all these words into one song.

CHORUS:
Create a memorable devotional hook that is easy to sing.

Keep Marathi simple, natural, heartfelt and singable.

Do not invent miracles, divine events or supernatural experiences
unless the user explicitly mentions them.

Keep the devotional song faithful to the user's story.
DEVOTIONAL MARATHI SEMANTIC CHECK:

When MOOD = Devotional AND LANGUAGE = Marathi:

Do not use Marathi words merely because they sound poetic.

Check the COMPLETE meaning of every sentence.
MARATHI HARD REJECTION RULE:

When LANGUAGE = Marathi:

Never return a lyric line if its complete meaning is unclear.

A line must pass all four tests:

1. Correct Marathi grammar
2. Clear Marathi meaning
3. Natural spoken Marathi
4. Natural singable Marathi

REJECT the line completely if it contains:
- unnatural word combinations
- invented-looking Marathi words
- incorrect verb forms
- incorrect gender agreement
- meaningless metaphors
- random objects or actions
- words connected only because they rhyme
- phrases that sound like machine-translated Hindi

IMPORTANT:
Do NOT repair an unnatural sentence by changing only one word.

Rewrite the WHOLE LINE in simple natural Marathi.

If poetic Marathi and natural Marathi conflict:
ALWAYS choose natural Marathi.

If rhyme and meaning conflict:
ALWAYS choose meaning.

NATIVE SPEAKER TEST:

Silently imagine a native Marathi songwriter reading every line.

If the reaction would be:
"हे मराठीत असं म्हणत नाहीत."

rewrite the line before returning the song.

SIMPLICITY RULE:

Simple natural Marathi is preferred over complicated poetic Marathi.

Examples:

Instead of:
"माझं आयुष्य तुझ्या पायांवर बसलं"

Use natural meaning such as:
"तुझ्या चरणी माझं आयुष्य अर्पण केलं"

Instead of:
"तूच माझी कृपा म्हणते"

Use:
"तुझी कृपा माझ्यावर राहू दे"

Instead of:
"तुच्छ भीतींवरून मी जागेल झालो"

Use:
"तुझ्या आधाराने माझी भीती दूर झाली"

Do not copy these examples unnecessarily.
Use them only as examples of natural sentence construction.

IMPORTANT:
Every devotional sentence must have a clear grammatical and semantic relationship.

Never create unnatural phrases such as:
"तिच्या कापच्यात"
"माझं आयुष्यभरचं उपवान"
"माझं आयुष्य तुझ्या पायांवर बसलं"
"तूच ही माझी कृपा"
or similar meaningless constructions.

Use natural Marathi devotional expressions such as:
"तुझ्या चरणी मला शांती मिळते"
"तूच माझा आधार आहेस"
"तुझी कृपा माझ्यावर राहू दे"
"तुझ्या आशीर्वादाने माझं मन शांत होतं"
"तुझ्यावर माझा पूर्ण विश्वास आहे"
"तुझ्या चरणी मी शरण आलो"
"तुझ्या कृपेने मला नवी आशा मिळाली"

PRONOUN CHECK:

When addressing the deity directly, use:
तू / तुझा / तुझी / तुझं / तुझ्या / तुला

Do not accidentally switch between:
तू, ती, तिचा, तिची, तिच्या

unless the song is intentionally talking ABOUT another female person.

MEANING CHECK:

Before returning each line, silently ask:

"या पूर्ण वाक्याचा मराठीत स्पष्ट अर्थ आहे का?"

If NO:
rewrite the entire sentence.

Do not fix only individual words.

NATURALNESS CHECK:

If a sentence is grammatically possible but a native Marathi singer would not naturally say or sing it,
rewrite it using simpler Marathi.

NATURAL MARATHI > POETIC WORDS > RHYME.

Never sacrifice meaning for rhyme.

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
