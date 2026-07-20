import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

export const announcementsRouter = Router();

announcementsRouter.get("/", auth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.*, (r.id IS NOT NULL) AS isRead
     FROM announcements a
     LEFT JOIN announcement_reads r
       ON r.announcement_id = a.id AND r.user_id = ?
     ORDER BY a.created_at DESC`,
    [req.user.id]
  );

  res.json(
    rows.map((row) => ({
      id: row.id,
      icon: row.icon,
      title: row.title,
      text: row.text,
      important: !!row.important,
      date: row.created_at,
      status: row.isRead ? "Leído" : "Confirmar lectura",
    }))
  );
});

announcementsRouter.post("/", auth, requireRole("educadora"), async (req, res) => {
  const { title, text, important } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: "Título y texto son obligatorios." });
  }

  const [result] = await pool.query(
    "INSERT INTO announcements (icon, title, text, important) VALUES (?, ?, ?, ?)",
    ["📢", title, text, important ? 1 : 0]
  );

  res.status(201).json({ id: result.insertId });
});

announcementsRouter.post("/:id/read", auth, async (req, res) => {
  await pool.query(
    "INSERT IGNORE INTO announcement_reads (announcement_id, user_id) VALUES (?, ?)",
    [req.params.id, req.user.id]
  );

  res.status(204).end();
});
