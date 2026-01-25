const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL; // <- добавишь в Railway Variables

// статика: public/index.html + public/ALARM.wav
app.use(express.static(path.join(__dirname, "public"), {
  etag: false,
  lastModified: false,
  setHeaders(res, filePath) {
    // чтобы экран всегда был свежий
    if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-store");
  }
}));

app.get("/health", (req, res) => res.status(200).send("ok"));

// ✅ ПРОКСИ: браузер зовет /api/orders, а сервер ходит в Google Apps Script
app.get("/api/orders", async (req, res) => {
  try {
    if (!APPS_SCRIPT_URL) {
      return res.status(500).json({ error: "APPS_SCRIPT_URL is not set" });
    }

    // Node 18+ -> fetch есть. Если вдруг нет, Railway обычно Node 18/20.
    const r = await fetch(APPS_SCRIPT_URL, { cache: "no-store" });
    const text = await r.text();

    if (!r.ok) {
      return res.status(502).json({ error: `Apps Script HTTP ${r.status}`, body: text.slice(0, 300) });
    }

    // Если Apps Script не "Anyone", он может вернуть HTML — отловим
    if (!text.trim().startsWith("{")) {
      return res.status(502).json({ error: "Apps Script did not return JSON", body: text.slice(0, 300) });
    }

    res.setHeader("Cache-Control", "no-store");
    res.type("application/json").send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Kitchen screen running on PORT =", PORT);
});

