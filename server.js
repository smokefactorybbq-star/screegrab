const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

app.use(express.static(path.join(__dirname, "public"), {
  etag: false,
  lastModified: false,
  setHeaders(res, filePath) {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-store");
    }
  }
}));

app.get("/health", (_req, res) => res.status(200).send("ok"));

app.get("/api/orders", async (_req, res) => {
  try {
    if (!APPS_SCRIPT_URL) {
      return res.status(500).json({ error: "APPS_SCRIPT_URL is not set" });
    }

    const r = await fetch(APPS_SCRIPT_URL, { cache: "no-store" });
    const text = await r.text();

    if (!r.ok) {
      return res.status(502).json({
        error: `Apps Script HTTP ${r.status}`,
        body: text.slice(0, 300)
      });
    }

    res.setHeader("Cache-Control", "no-store");
    res.type("application/json").send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Courier screen running on PORT =", PORT);
});
