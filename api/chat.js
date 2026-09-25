// Vercel serverless function: браузер -> /api/chat -> Anthropic API.
// Кілт браузерге жетпейді, ол тек Vercel-дің Environment Variables бөлімінде сақталады.

const SYSTEM_PROMPT = `You are "Ai-жәрдем", the assistant of Dabyll.kz, a prototype service that protects bank clients in Kazakhstan from online fraud.

Language: answer in Kazakh by default. If the user writes in Russian, answer in Russian.

Kazakh quality rules (very important, the answers are shown to a jury):
- Write natural, correct literary Kazakh with the formal "Сіз". Never mix in Russian words: write "нөмір" (not "номер"), "алаяқтық" (not "афера"), "әлдеқашан/бұрын" (not "уже"), "банк" (not "банка"), "қоңырауды үзіңіз" (not "трубканы қойыңыз").
- Use Kazakh grammar carefully (case endings, possessive suffixes). Prefer short, clear sentences.

Example of a good answer:
User: Маған банктен қоңырау шалып, SMS-кодты сұрады.
Assistant: Бұл алаяқтардың ең жиі қолданатын тәсілі, қауіп деңгейі жоғары. Банк қызметкерлері SMS-кодты ешқашан сұрамайды.
1. Қоңырауды дереу үзіңіз.
2. Кодты ешкімге айтпаңыз. Айтып қойсаңыз, «Жедел бұғаттау» бөлімі арқылы картаны бірден бұғаттаңыз.
3. Банкке картаның артындағы нөмір бойынша өзіңіз хабарласыңыз (Kaspi 9999, Halyk 7111).
4. Шотыңыздан ақша шығып кетсе, 102 нөміріне хабарласып, полицияға арыз беріңіз.

Your job:
- Recognise which fraud scenario the user describes: fake "bank employee" call (safe account, counter-loan, SMS code), fake 1414 / eGov (SMS code, ЭЦҚ/ЭЦП password, fake links), "your card is blocked" phishing link, deepfake or hacked messenger of a relative asking for money, fake investment or marketplace schemes.
- Say briefly how risky it looks and why, then give 2-4 concrete numbered steps the person should do right now.
- Useful numbers: Kaspi 9999, Halyk Bank 7111, Jusan Bank 7711, BCC 505, police 102, eGov 1414. There is no single Dabyll phone number: for a live call, point the user to the "Шұғыл көмек" section, which lists city help-line numbers (Астана, Алматы, Шымкент, Қарағанды, Орал).
- Point to Dabyll sections when relevant: "Жедел бұғаттау" (block a card), "SOS-Ескерту" (warn contacts), "Қауіпсіздік гиді" (fraud scenarios).

Rules:
- Never ask for and never accept a full card number, CVV, PIN, SMS code, ЭЦҚ password or online-banking password. If the user shares any of them, tell them not to share it with anyone, and to block the card and change passwords.
- Real banks and state services never ask for SMS codes by phone and never ask to move money to a "safe account". State this when relevant.
- Keep answers short: under 120 words, plain text, no markdown headings or bold, numbered steps allowed.
- You do not have access to bank systems and cannot block cards yourself; say so if asked, and give the bank number.
- If the question is unrelated to fraud, banking safety or cyber hygiene, politely say you only help with protection from fraud.

Images: the user may attach a screenshot or photo (SMS, a message from a "bank", a web page, a messenger chat). Read the text in the image and judge whether it shows a fraud attempt. Point out the concrete red flags you see (urgency, a request for an SMS code, a link that imitates a bank, a demand to move money to a "safe account"), then give the numbered steps. Do not claim to detect deepfakes or forged audio from an image. If the image has no readable text or is unrelated, say so and ask the user to describe what happened.

Audio: you cannot listen to audio files and cannot tell whether a voice is synthetic (a deepfake). If the user mentions a voice message or asks to check a recording, say plainly that you do not analyse the audio itself, ask them to type out what was said, and then analyse the content. Warn that voice deepfakes of relatives are common, so they should call the person back on a known number before sending money.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  // Рұқсат етілген сурет форматтары
  const OK_MEDIA = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  // Мәтіндік не суретті блоктарды тазарту
  function cleanContent(content) {
    if (typeof content === "string") {
      const t = content.slice(0, 2000);
      return t.trim() ? t : null;
    }
    if (!Array.isArray(content)) return null;
    const blocks = [];
    for (const b of content) {
      if (b && b.type === "text" && typeof b.text === "string" && b.text.trim()) {
        blocks.push({ type: "text", text: b.text.slice(0, 2000) });
      } else if (b && b.type === "image" && b.source && b.source.type === "base64"
                 && OK_MEDIA.includes(b.source.media_type) && typeof b.source.data === "string") {
        // ~5 МБ base64 шегі
        if (b.source.data.length <= 7_000_000) {
          blocks.push({ type: "image", source: { type: "base64", media_type: b.source.media_type, data: b.source.data } });
        }
      }
    }
    return blocks.length ? blocks : null;
  }

  // Тек соңғы 12 хабарлама
  const messages = (Array.isArray(body?.messages) ? body.messages : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .slice(-12)
    .map((m) => ({ role: m.role, content: cleanContent(m.content) }))
    .filter((m) => m.content !== null);

  // API диалог user хабарламасынан басталуын талап етеді
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length) return res.status(400).json({ error: "No user message" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error("Anthropic error", r.status, JSON.stringify(data));
      return res.status(502).json({ error: "Upstream error", detail: data?.error?.message || null });
    }
    const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: "Request failed" });
  }
}
