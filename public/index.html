import express from "express";
import http from "http";

// ==========================
// ENV
// ==========================
const INGEST_SECRET = process.env.INGEST_SECRET;
if (!INGEST_SECRET) throw new Error("INGEST_SECRET is not set");

// ==========================
// APP
// ==========================
const app = express();
app.use(express.json({ limit: "200kb" }));

// Если у тебя есть public/ads1.jpg ... public/ALARM.mp3 — включи статику:
app.use(express.static("public", { setHeaders: (res) => res.setHeader("Cache-Control", "no-store") }));

// ==========================
// MEMORY (format for courier screen)
// ==========================
// stored: { id, order, start_ts, minutes, expiresAt }
let orders = [];
let updatedAtMs = Date.now();

function prune() {
  const now = Date.now();
  orders = orders.filter((o) => o.expiresAt > now);
  orders.sort((a, b) => b.start_ts - a.start_ts);
  orders = orders.slice(0, 10);
}

function addOrder(orderNo, minutes) {
  const now = Date.now();
  const mins = Math.max(1, Math.min(240, Math.floor(Number(minutes) || 0)));
  const start_ts = now;
  const expiresAt = start_ts + mins * 60_000 + 5 * 60_000; // +5min after ready

  orders.unshift({
    id: crypto.randomUUID(),
    order: String(orderNo || "").trim(),
    start_ts,
    minutes: mins,
    expiresAt,
  });

  updatedAtMs = now;
  prune();
}

// ==========================
// ROUTES
// ==========================
app.get("/", (_req, res) => {
  res.type("text/plain").send("COURIER SCREEN OK. Open /screen");
});

/**
 * DEPLOY #1 -> DEPLOY #2
 * POST /ingest
 * body: { secret, orderNo, prepMinutes }
 */
app.post("/ingest", (req, res) => {
  try {
    const { secret, orderNo, prepMinutes } = req.body || {};
    if (secret !== INGEST_SECRET) return res.status(403).json({ ok: false, error: "forbidden" });

    addOrder(orderNo, prepMinutes);
    console.log("INGEST ✅", { orderNo, prepMinutes, count: orders.length });

    return res.json({ ok: true });
  } catch (e) {
    console.error("INGEST ERROR:", e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

/**
 * API for courier HTML (your screen expects this)
 * GET /api/orders -> { updated_at, orders:[{order,start_ts,minutes}] }
 */
app.get("/api/orders", (_req, res) => {
  prune();
  res.setHeader("Cache-Control", "no-store");
  res.json({
    updated_at: updatedAtMs,
    orders: orders.map(({ id, order, start_ts, minutes }) => ({ id, order, start_ts, minutes })),
  });
});

/**
 * Courier screen
 * GET /screen
 */
app.get("/screen", (_req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.type("html").send(getCourierHtml());
});

// ==========================
// HTML (kept as a function so Node doesn't try to interpolate your ${} inside)
// ==========================
function getCourierHtml() {
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Kitchen Screen</title>

  <style>
    :root { 
      --bg:#0b1220; 
      --card:#121a2b; 
      --text:#ffffff; 
      --muted:#9aa7c7; 
      --orange:#ff9900;
      --green:#00ff66;
      --ready:#00ff00;
      --ticker-bg:#020617;
      --ticker-text:#ffffff;
    }

    *{box-sizing:border-box}

    body{
      margin:0;
      background:var(--bg);
      color:var(--text);
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
      padding-bottom:64px;
    }

    .wrap{max-width:1200px;margin:0 auto;padding:24px}

    header{
      display:flex;
      gap:16px;
      align-items:center;
      justify-content:space-between;
      margin-bottom:16px
    }

    h1{font-size:28px;margin:0}

    .right{display:flex;gap:12px;align-items:center}

    .badge{
      background:rgba(255,255,255,.08);
      padding:8px 12px;
      border-radius:12px;
      color:var(--muted);
      font-size:14px
    }

    button{
      cursor:pointer;
      border:0;
      border-radius:14px;
      padding:10px 14px;
      background:rgba(255,255,255,.12);
      color:var(--text);
      font-weight:800
    }

    .grid{display:grid;grid-template-columns:1fr;gap:12px}

    .row{
      display:grid;
      grid-template-columns: 1.2fr .8fr;
      gap:12px;
      align-items:center;
      background:var(--card);
      border-radius:18px;
      padding:18px
    }

    .order{font-size:34px;font-weight:900}
    .time{font-size:34px;font-weight:900;text-align:right}
    .sub{color:var(--muted);font-size:14px;margin-top:6px}

    .ready{
      outline:3px solid rgba(0,255,0,.8);
      animation: pulse 1s infinite;
    }

    @keyframes pulse { 
      0%{box-shadow:0 0 0 rgba(0,255,0,.0)} 
      50%{box-shadow:0 0 30px rgba(0,255,0,.6)} 
      100%{box-shadow:0 0 0 rgba(0,255,0,.0)} 
    }

    /* ===== ADS ===== */
    .ads{
      display:none;
      width:100%;
      height:calc(100vh - 140px);
      align-items:center;
      justify-content:center;
    }

    .ads img{
      max-width:100%;
      max-height:100%;
      object-fit:contain;
      border-radius:24px;
      box-shadow:0 0 40px rgba(0,0,0,.4);
    }

    /* ===== TICKER ===== */
    .ticker{
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 56px;
      background: var(--ticker-bg);
      border-top: 2px solid rgba(255,255,255,.1);
      overflow: hidden;
      display: flex;
      align-items: center;
      z-index: 9999;
    }

    .ticker-track{
      display: inline-block;
      white-space: nowrap;
      padding-left: 100%;
      animation: ticker-move 30s linear infinite;
      font-size: 22px;
      font-weight: 800;
      color: var(--ticker-text);
    }

    .ticker-text{
      display: inline-block;
      padding-right: 80px;
    }

    @keyframes ticker-move {
      0% { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    }
  </style>
</head>

<body>
  <div class="wrap">
    <header>
      <div>
        <h1>Orders</h1>
        <div class="sub" id="updated">—</div>
      </div>
      <div class="right">
        <div class="badge" id="status">Connecting…</div>
        <button id="soundBtn">Enable alarm</button>
      </div>
    </header>

    <!-- ADS -->
    <div class="ads" id="ads">
      <img id="adsImg" src="ads1.jpg" alt="Ads">
    </div>

    <!-- ORDERS -->
    <div class="grid" id="list"></div>

    <!-- SOUND -->
    <audio id="alarm" src="ALARM.mp3" preload="auto"></audio>
  </div>

  <!-- TICKER -->
  <div class="ticker">
    <div class="ticker-track">
      <span class="ticker-text">
        เรียนไรเดอร์ทุกท่าน! ขณะนี้เรากำลังเตรียมออเดอร์ของท่านอยู่ โดยสามารถดูเวลาการเตรียมอาหารได้ที่หน้าจอ 
        เมื่อออเดอร์พร้อมแล้ว พนักงานของเราจะนำออเดอร์ไปส่งให้ท่านทันที 
        ขอขอบคุณที่ช่วยให้การจัดส่งเป็นไปอย่างรวดเร็วและมีคุณภาพ!
      </span>
      <span class="ticker-text">
        เรียนไรเดอร์ทุกท่าน! ขณะนี้เรากำลังเตรียมออเดอร์ของท่านอยู่ โดยสามารถดูเวลาการเตรียมอาหารได้ที่หน้าจอ 
        เมื่อออเดอร์พร้อมแล้ว พนักงานของเราจะนำออเดอร์ไปส่งให้ท่านทันที 
        ขอขอบคุณที่ช่วยให้การจัดส่งเป็นไปอย่างรวดเร็วและมีคุณภาพ!
      </span>
    </div>
  </div>

<script>
  const API_URL = "/api/orders";
  const POLL_MS = 4000;
  const TICK_MS = 250;

  // ===== ADS =====
  const ADS_IMAGES = ["ads1.jpg", "ads2.jpg", "ads3.jpg", "ads4.jpg"];
  let adsIndex = 0;

  const adsEl = document.getElementById("ads");
  const adsImg = document.getElementById("adsImg");
  const listEl = document.getElementById("list");

  setInterval(() => {
    adsIndex = (adsIndex + 1) % ADS_IMAGES.length;
    adsImg.src = ADS_IMAGES[adsIndex];
  }, 10000);

  function showAds(){
    adsEl.style.display = "flex";
    listEl.style.display = "none";
  }

  function showOrders(){
    adsEl.style.display = "none";
    listEl.style.display = "grid";
  }

  // ===== SOUND =====
  const PAUSE_AFTER_ALARM_MS = 30000;

  const alarm = document.getElementById("alarm");
  const soundBtn = document.getElementById("soundBtn");

  let alarmEnabled = false;
  let restartTimer = null;

  function clearRestartTimer(){
    if (restartTimer){
      clearTimeout(restartTimer);
      restartTimer = null;
    }
  }

  function playAlarmFromStart(){
    if (!alarmEnabled) return;
    clearRestartTimer();
    try { alarm.pause(); alarm.currentTime = 0; } catch(e){}
    alarm.play().catch(err => console.log("Alarm play error:", err));
  }

  alarm.addEventListener("ended", () => {
    if (!alarmEnabled) return;
    clearRestartTimer();
    restartTimer = setTimeout(playAlarmFromStart, PAUSE_AFTER_ALARM_MS);
  });

  soundBtn.addEventListener("click", async () => {
    try {
      alarmEnabled = true;
      soundBtn.textContent = "Alarm enabled ✓";

      alarm.currentTime = 0;
      await alarm.play();
      alarm.pause();
      alarm.currentTime = 0;

      clearRestartTimer();
      restartTimer = setTimeout(playAlarmFromStart, PAUSE_AFTER_ALARM_MS);

    } catch (e) {
      console.log("Enable alarm failed:", e);
      soundBtn.textContent = "Sound blocked / file error";
    }
  });

  // ===== ORDERS =====
  const elUpdated = document.getElementById("updated");
  const elStatus = document.getElementById("status");

  let latestData = { orders: [], updated_at: 0 };

  function fmtMMSS(sec){
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  }

  function remainingSec(o, nowMs){
    const endMs = o.start_ts + o.minutes * 60000;
    return (endMs - nowMs) / 1000;
  }

  function render(){
    const now = Date.now();
    const orders = latestData.orders || [];

    elUpdated.textContent = "Updated: " + new Date(latestData.updated_at || now).toLocaleString();

    if (!orders.length){
      showAds();
      listEl.innerHTML = "";
      return;
    }

    showOrders();

    listEl.innerHTML = orders.map(o => {
      const rem = remainingSec(o, now);
      const isReady = rem <= 0;
      const timeText = isReady ? "READY" : fmtMMSS(rem);

      let color = "var(--orange)";
      if (rem <= 600 && rem > 0) color = "var(--green)";
      if (rem <= 0) color = "var(--ready)";

      return \`
        <div class="row \${isReady ? "ready" : ""}">
          <div>
            <div class="order">Order \${o.order}</div>
            <div class="sub">\${o.minutes} min</div>
          </div>
          <div class="time" style="color:\${color}">\${timeText}</div>
        </div>
      \`;
    }).join("");
  }

  async function poll(){
    try {
      elStatus.textContent = "Loading…";
      const r = await fetch(API_URL, { cache:"no-store" });
      const data = await r.json();
      latestData = data;
      elStatus.textContent = "Online";
      render();
    } catch(e){
      elStatus.textContent = "Offline / API error";
      showAds();
    }
  }

  poll();
  setInterval(poll, POLL_MS);
  setInterval(render, TICK_MS);
</script>
</body>
</html>`;
}

// ==========================
// START
// ==========================
const PORT = process.env.PORT || 3000;
http.createServer(app).listen(PORT, () => {
  console.log("Courier screen listening on", PORT);
});
