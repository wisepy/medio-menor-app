import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { uploadsDir } from "./uploads.js";
import { autoBootstrap } from "./autoBootstrap.js";

import { authRouter } from "./routes/auth.js";
import { announcementsRouter } from "./routes/announcements.js";
import { eventsRouter } from "./routes/events.js";
import { photosRouter } from "./routes/photos.js";
import { treasuryRouter } from "./routes/treasury.js";
import { votesRouter } from "./routes/votes.js";
import { marketplaceRouter } from "./routes/marketplace.js";
import { documentsRouter } from "./routes/documents.js";
import { communityRouter } from "./routes/community.js";
import { familiesRouter } from "./routes/families.js";
import { childrenRouter } from "./routes/children.js";
import { directivaRouter } from "./routes/directiva.js";
import { notificationsRouter } from "./routes/notifications.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const localDist = path.join(__dirname, "dist");
const parentDist = path.join(__dirname, "..", "dist");
const clientDist = fs.existsSync(localDist) ? localDist : parentDist;

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.use("/api/auth", authRouter);
app.use("/api/announcements", announcementsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/photos", photosRouter);
app.use("/api/treasury", treasuryRouter);
app.use("/api/votes", votesRouter);
app.use("/api/marketplace", marketplaceRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/community", communityRouter);
app.use("/api/families", familiesRouter);
app.use("/api/children", childrenRouter);
app.use("/api/directiva", directivaRouter);
app.use("/api/notifications", notificationsRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));

  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Medio Menor API escuchando en http://localhost:${port}`);
});

autoBootstrap().catch((error) => {
  console.error("Error en el auto-bootstrap de la base de datos:", error);
});
