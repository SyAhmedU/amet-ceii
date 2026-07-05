/* Handles the Apply form and the Contact form.
   POST /api/apply with the form fields; if RESEND_API_KEY is set it
   emails aceii@ametuniv.ac.in, otherwise it returns 503 and the page
   asks the user to email us directly. Also does a few basic checks
   (POST only, size limit, honeypot, simple rate limit) to keep spam out. */

const MAX_BYTES = 12 * 1024;                 // 12 KB payload cap
const RL_WINDOW_MS = 60 * 1000;
const RL_MAX = 6;                            // submissions / IP / minute
const hits = new Map();                      // best-effort in-memory (per lambda)

function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip) || { n: 0, t: now };
  if (now - rec.t > RL_WINDOW_MS) { rec.n = 0; rec.t = now; }
  rec.n += 1;
  hits.set(ip, rec);
  if (hits.size > 5000) hits.clear();        // crude memory bound
  return rec.n > RL_MAX;
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(k, v) {
  if (v == null || v === "") return "";
  return '<tr><td style="padding:6px 14px 6px 0;color:#6E8A98;font:12px monospace;vertical-align:top;text-transform:uppercase;letter-spacing:1px">' +
    esc(k) + '</td><td style="padding:6px 0;color:#0b2537">' + esc(v).replace(/\n/g, "<br>") + "</td></tr>";
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse body (Vercel usually parses JSON; guard for string/raw)
  let data = req.body;
  try {
    if (typeof data === "string") data = JSON.parse(data || "{}");
  } catch (_) { return res.status(400).json({ error: "Invalid JSON" }); }
  if (!data || typeof data !== "object") return res.status(400).json({ error: "Empty payload" });

  if (JSON.stringify(data).length > MAX_BYTES) {
    return res.status(413).json({ error: "Payload too large" });
  }

  // Honeypot — silently accept bots without emailing
  if (data.website_hp) return res.status(200).json({ ok: true, delivered: false });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "0.0.0.0";
  if (rateLimited(ip)) return res.status(429).json({ error: "Too many submissions — try again shortly." });

  // Minimal validation
  const email = (data.email || "").trim();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: "A valid email is required." });
  }

  const isContact = data.kind === "contact";
  const title = isContact ? "New contact message" : "New incubation application";

  // Build a clean email from whatever fields arrived
  const skip = new Set(["kind", "website_hp"]);
  const rows = Object.keys(data)
    .filter((k) => !skip.has(k))
    .map((k) => row(k.replace(/_/g, " "), data[k]))
    .join("");

  const html =
    '<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto">' +
    '<div style="background:#04101B;padding:22px 26px;border-radius:12px 12px 0 0">' +
    '<div style="color:#34E4CE;font:11px monospace;letter-spacing:3px;text-transform:uppercase">AMET CEII · ' +
    (isContact ? "CONTACT" : "APPLICATION") + '</div>' +
    '<div style="color:#EAF3F6;font-size:20px;margin-top:6px">' + esc(title) + "</div></div>" +
    '<div style="border:1px solid #e3e9ec;border-top:none;border-radius:0 0 12px 12px;padding:22px 26px;background:#fff">' +
    '<table style="width:100%;border-collapse:collapse;font-size:14px">' + rows + "</table>" +
    '<p style="color:#6E8A98;font-size:12px;margin-top:18px">Received ' + new Date().toUTCString() +
    " · IP " + esc(ip) + "</p></div></div>";

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CEII_FROM || "AMET CEII <onboarding@resend.dev>";
  const to = process.env.CEII_TO || "aceii@ametuniv.ac.in";

  // No provider configured → be honest, let client show the mailto fallback
  if (!apiKey) {
    return res.status(503).json({ error: "Email delivery is not configured yet.", delivered: false });
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: (isContact ? "[CEII Contact] " : "[CEII Application] ") + (data.name || email),
        html,
      }),
    });
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return res.status(502).json({ error: "Mail provider error", detail: t.slice(0, 200) });
    }
    return res.status(200).json({ ok: true, delivered: true });
  } catch (err) {
    return res.status(502).json({ error: "Delivery failed", detail: String(err).slice(0, 200) });
  }
};
