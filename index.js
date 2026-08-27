const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 9595;
const KOKORO_URL = process.env.KOKORO_URL || "http://localhost:7860";

app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", async (_req, res) => {
  try {
    const response = await fetch(`${KOKORO_URL}/tts/status`);
    res.status(response.ok ? 200 : 503).json({
      app: "ok",
      kokoro: response.ok ? "ok" : "unavailable",
      kokoroStatus: response.status,
    });
  } catch (error) {
    res
      .status(503)
      .json({ app: "ok", kokoro: "unavailable", error: error.message });
  }
});

app.post("/tts", async (req, res) => {
  const text = String(req.body?.text || "").trim();
  const voice = String(req.body?.voice || "pf_dora").trim();
  const speed = Number(req.body?.speed ?? 0.85);

  if (!text) return res.status(400).json({ error: "Informe um texto." });
  if (text.length > 1000)
    return res.status(400).json({ error: "Use no máximo 1000 caracteres." });
  if (!Number.isFinite(speed) || speed < 0.5 || speed > 1.5) {
    return res.status(400).json({ error: "Velocidade inválida." });
  }

  const startedAt = performance.now();

  try {
    const response = await fetch(`${KOKORO_URL}/tts/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice,
        speed,
        output_format: "wav",
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return res.status(502).json({
        error: "Kokoro não conseguiu gerar o áudio.",
        status: response.status,
        details,
      });
    }

    const audio = Buffer.from(await response.arrayBuffer());
    const generationMs = Math.round(performance.now() - startedAt);

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Length", audio.length);
    res.setHeader("X-Generation-Time-Ms", String(generationMs));
    res.setHeader("Cache-Control", "no-store");
    res.send(audio);
  } catch (error) {
    res.status(502).json({
      error: "Não foi possível conectar ao Kokoro.",
      details: error.message,
      hint: "Confira se o container está rodando em http://localhost:7860",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Kokoro Speed Test: http://localhost:${PORT}`);
  console.log(`Kokoro API: ${KOKORO_URL}`);
});
