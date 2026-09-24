// Демо үшін базаны мысалдармен толтыратын бір реттік функция.
// Браузерден бір рет ашылады, содан кейін өшіруге болады.
import { Redis } from "@upstash/redis";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const SEED = [
  { kind: "phone", value: "77012345678", reports: 5, window24h: 5, investigation: true, lastReason: "«Банк қызметкері» болып қоңырау шалған" },
  { kind: "phone", value: "77776543210", reports: 3, window24h: 2, investigation: true, lastReason: "1414 атын жамылған" },
  { kind: "card", value: "4400430212345678", reports: 4, window24h: 4, investigation: true, bank: "Kaspi.kz", lastReason: "«Қауіпсіз шотқа» аудару" },
  { kind: "card", value: "5169491012345678", reports: 1, window24h: 1, investigation: false, bank: "Halyk Bank", lastReason: "Жалған дүкен" },
  { kind: "link", value: "kaspi-bonus.kz", reports: 6, window24h: 3, investigation: true, lastReason: "Фишинг сілтемесі" },
  { kind: "account", value: "KZ123456789012345678", reports: 2, window24h: 2, investigation: true, lastReason: "Инвестиция алаяқтығы" },
];

export default async function handler(req, res) {
  const redis = getRedis();
  if (!redis) return res.status(503).json({ error: "no-store" });
  try {
    for (const s of SEED) {
      const { kind, value, ...rec } = s;
      await redis.set(`bl:${kind}:${value}`, rec);
    }
    return res.status(200).json({ ok: true, seeded: SEED.length });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: "upstream" });
  }
}
