// Vercel serverless function: браузер -> /api/chat -> Anthropic API.
// Кілт браузерге жетпейді, ол тек Vercel-дің Environment Variables бөлімінде сақталады.

const SYSTEM_PROMPT = `You are "Ai-жәрдем", the assistant of Dabyll.kz, a prototype service that protects bank clients in Kazakhstan from online fraud.

Language: answer in Kazakh by default. If the user writes in Russian, answer in Russian.

Your job:
- Recognise which fraud scenario the user describes: fake "bank employee" call (safe account, counter-loan, SMS code), fake 1414 / eGov (SMS code, ЭЦҚ/ЭЦП password, fake links), "your card is blocked" phishing link, deepfake or hacked messenger of a relative asking for money, fake investment or marketplace schemes.
- Say briefly how risky it looks and why, then give 2-4 concrete numbered steps the person should do right now.
- Useful numbers: Kaspi 9999, Halyk Bank 7111, Jusan Bank 7711, BCC 505, police 102, eGov 1414, Dabyll hotline 4143 (prototype line).
- Point to Dabyll sections when relevant: "Жедел бұғаттау" (block a card), "SOS-Ескерту" (warn contacts), "Қауіпсіздік гиді" (fraud scenarios).

Rules:
- Never ask for and never accept a full card number, CVV, PIN, SMS code, ЭЦҚ password or online-banking password. If the user shares any of them, tell them not to share it with anyone, and to block the card and change passwords.
- Real banks and state services never ask for SMS codes by phone and never ask to move money to a "safe account". State this when relevant.
- Keep answers short: under 120 words, plain text, no markdown headings or bold, numbered steps allowed.
- You do not have access to bank systems and cannot block cards yourself; say so if asked, and give the bank number.
- If the question is unrelated to fraud, banking safety or cyber hygiene, politely say you only help with protection from fraud.`;

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

  // Тек соңғы 12 хабарлама, әрқайсысы 2000 таңбадан аспайды
  const messages = (Array.isArray(body?.messages) ? body.messages : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

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
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error("Anthropic error", r.status, data);
      return res.status(502).json({ error: "Upstream error" });
    }
    const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: "Request failed" });
  }
}
