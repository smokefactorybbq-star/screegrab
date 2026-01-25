const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Раздаём всё из папки public (index.html, bgm.mp3)
app.use(express.static(path.join(__dirname, "public"), {
  // чтобы браузер не держал старую версию экрана
  etag: false,
  lastModified: false,
  setHeaders(res, filePath) {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-store");
    }
  }
}));

// healthcheck
app.get("/health", (req, res) => res.status(200).send("ok"));

app.listen(PORT, () => {
  console.log(`Kitchen screen running on port ${PORT}`);
});

