import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { uploadsDir } from "../uploads.js";

export const photosRouter = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
    },
  }),
});

photosRouter.get("/", auth, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM photos ORDER BY created_at DESC"
  );

  res.json(
    rows.map((row) => ({
      id: row.id,
      emoji: row.emoji,
      title: row.title,
      description: row.description,
      activity: row.activity,
      imageUrl: row.image_url,
      likes: row.likes,
    }))
  );
});

photosRouter.get("/daily", auth, async (req, res) => {
  const [[row]] = await pool.query(
    "SELECT * FROM photos ORDER BY created_at DESC LIMIT 1"
  );

  if (!row) return res.json(null);

  res.json({
    id: row.id,
    title: row.title,
    description: row.description,
    date: "Hoy",
    activity: row.activity,
    likes: row.likes,
    imageUrl: row.image_url,
  });
});

photosRouter.post("/:id/like", auth, async (req, res) => {
  await pool.query("UPDATE photos SET likes = likes + 1 WHERE id = ?", [
    req.params.id,
  ]);

  const [[row]] = await pool.query("SELECT likes FROM photos WHERE id = ?", [
    req.params.id,
  ]);

  res.json({ likes: row.likes });
});

photosRouter.post(
  "/",
  auth,
  requireRole("educadora"),
  upload.single("image"),
  async (req, res) => {
    const { title, description, activity } = req.body;

    if (!title) {
      return res.status(400).json({ error: "El título es obligatorio." });
    }

    const imageUrl = req.file ? `/uploads/${path.basename(req.file.path)}` : null;

    const [result] = await pool.query(
      "INSERT INTO photos (emoji, title, description, activity, image_url) VALUES (?, ?, ?, ?, ?)",
      ["📸", title, description || null, activity || "Actividad de aprendizaje", imageUrl]
    );

    res.status(201).json({ id: result.insertId, imageUrl });
  }
);
