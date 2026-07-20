import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { uploadsDir } from "../uploads.js";

export const documentsRouter = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
    },
  }),
});

documentsRouter.get("/", auth, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM documents ORDER BY created_at DESC"
  );

  res.json(
    rows.map((row) => ({
      id: row.id,
      icon: row.icon,
      title: row.title,
      subtitle: row.subtitle,
      fileUrl: row.file_url,
    }))
  );
});

documentsRouter.post(
  "/",
  auth,
  requireRole("educadora"),
  upload.single("file"),
  async (req, res) => {
    const { title, subtitle } = req.body;

    if (!title) {
      return res.status(400).json({ error: "El título es obligatorio." });
    }

    const fileUrl = req.file ? `/uploads/${path.basename(req.file.path)}` : null;

    const [result] = await pool.query(
      "INSERT INTO documents (icon, title, subtitle, file_url) VALUES (?, ?, ?, ?)",
      [req.file ? "📄" : "📝", title, subtitle || null, fileUrl]
    );

    res.status(201).json({ id: result.insertId, fileUrl });
  }
);
