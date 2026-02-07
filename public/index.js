import express from "express";
import http from "http";

const INGEST_SECRET = process.env.INGEST_SECRET;
if (!INGEST_SECRET) throw new Error("INGEST_SECRET is not set");

const app = express();
app.use(express.json({ limit: "200kb" }));

// ✅ ВАЖНО: раздаём public/ как статику (screen.html, ads, mp3)
app.use(express.static("public", {
  setHeaders(res) { res.setHeader("Cache-Control", "no-store"); }
}));

// ===== memory =====
let orders = [];          // [{id, order, start_ts, minutes, expiresAt}]
let updatedAtMs = Date.now();

function prune() {
  const now = Date.now();
  orders = orders.filter(o => o.expiresAt > now);
  orders.sort((a,b)=> b.start_ts - a.start_ts);
  orders = orders.slice(0, 10);
}

function addOrder(orderNo, minutes) {
  const now = Date.now();
  const mins = Math.max(1, Math.min(240, Math.floor(Number(minutes) || 0)));
  const start_ts = now;
  const expiresAt = start_ts + mins * 60_000 + 5 * 60_000;

  orders.unshift({
    id: crypto.randomUUID(),
    order: String(orderNo || "").trim(),
    start_ts,
    minutes: mins,
    expiresAt
  });

  updatedAtMs = now;
  prune();
}

// ===== routes =====
app.get("/", (_req, res) => res.type("text/plain").send("COURIER DEPLOY OK. Open /screen.html"));

app.post("/ingest", (req, res) => {
  try {
    const { secret, orderNo, prepMinutes } = req.body || {};
    if (secret !== INGEST_SECRET) return res.status(403).json({ ok:false, error:"forbidden" });

    addOrder(orderNo, prepMinutes);
    console.log("INGEST ✅", { orderNo, prepMinutes, count: orders.length });

    return res.json({ ok:true });
  } catch (e) {
    console.error("INGEST ERROR:", e);
    return res.status(500).json({ ok:false, error:String(e) });
  }
});

app.get("/api/orders", (_req, res) => {
  prune();
  res.setHeader("Cache-Control", "no-store");
  res.json({
    updated_at: updatedAtMs,
    orders: orders.map(({ id, order, start_ts, minutes }) => ({ id, order, start_ts, minutes }))
  });
});

const PORT = process.env.PORT || 3000;
http.createServer(app).listen(PORT, () => {
  console.log("Courier deploy listening on", PORT);
});
