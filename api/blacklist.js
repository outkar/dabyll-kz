// Dabyll.kz — Қара тізім базасы (ортақ база).
// Vercel serverless function. Redis-ті Upstash арқылы сақтайды.
// Redis жоқ болса, 200 орнына 503 қайтарады да, фронтенд локаль режимге көшеді.

import { Redis } from "@upstash/redis";

const REPORT_THRESHOLD = 2; // демо үшін төмен; нақты жүйеде жоғары болады

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// Енгізілген мәнді түр бойынша қалыпқа келтіру
function normalize(kind, raw) {
  const v = String(raw || "").trim();
  if (!v) return null;
  if (kind === "phone") {
    let d = v.replace(/[^\d+]/g, "").replace(/^8/, "7");
    d = d.replace(/[^\d]/g, "");
    return d.length >= 10 ? d : null;
  }
  if (kind === "card") {
    const d = v.replace(/\D/g, "");
    return d.length >= 12 && d.length <= 19 ? d : null;
  }
  if (kind === "account") {
    const d = v.replace(/\s/g, "").toUpperCase();
    return d.length >= 8 ? d : null;
  }
  if (kind === "link") {
    let s = v.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
    return s.length >= 3 ? s : null;
  }
  return null;
}

const KINDS = ["phone", "card", "account", "link"];
const keyFor = (kind, value) => `bl:${kind}:${value}`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const redis = getRedis();
  if (!redis) return res.status(503).json({ error: "no-store" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }

  const action = body?.action;
  const kind = body?.kind;
  if (!KINDS.includes(kind)) return res.status(400).json({ error: "bad-kind" });

  const value = normalize(kind, body?.value);
  if (!value) return res.status(400).json({ error: "bad-value" });

  const key = keyFor(kind, value);

  try {
    if (action === "check") {
      const rec = await redis.get(key);
      if (!rec) return res.status(200).json({ found: false });
      return res.status(200).json({
        found: true,
        reports: rec.reports || 0,
        window24h: rec.window24h || rec.reports || 0,
        investigation: !!rec.investigation,
        bank: rec.bank || null,
        lastReason: rec.lastReason || null,
      });
    }

    if (action === "report") {
      // Бір браузер бір жазбаны қайталап тіркемеуі үшін — клиент жіберген ұялы белгі
      const voter = String(body?.voter || "").slice(0, 64);
      const votersKey = key + ":voters";
      let isNew = true;
      if (voter) {
        const added = await redis.sadd(votersKey, voter);
        isNew = added === 1;
      }
      const rec = (await redis.get(key)) || { reports: 0, window24h: 0, investigation: false };
      if (isNew) {
        rec.reports = (rec.reports || 0) + 1;
        rec.window24h = (rec.window24h || 0) + 1;
      }
      if (body?.bank) rec.bank = String(body.bank).slice(0, 40);
      if (body?.reason) rec.lastReason = String(body.reason).slice(0, 120);
      const justStarted = !rec.investigation && rec.reports >= REPORT_THRESHOLD;
      if (rec.reports >= REPORT_THRESHOLD) rec.investigation = true;
      await redis.set(key, rec);
      return res.status(200).json({
        ok: true,
        counted: isNew,
        reports: rec.reports,
        investigation: !!rec.investigation,
        justStarted,
        threshold: REPORT_THRESHOLD,
      });
    }

    return res.status(400).json({ error: "bad-action" });
  } catch (err) {
    console.error("blacklist error", err);
    return res.status(502).json({ error: "upstream" });
  }
}
