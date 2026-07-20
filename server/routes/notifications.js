import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

export const notificationsRouter = Router();

notificationsRouter.get("/", auth, async (req, res) => {
  const [announcements] = await pool.query(
    "SELECT id, title, text, created_at FROM announcements ORDER BY created_at DESC LIMIT 5"
  );

  const [photos] = await pool.query(
    "SELECT id, title, created_at FROM photos ORDER BY created_at DESC LIMIT 3"
  );

  const items = [
    ...announcements.map((a) => ({
      id: `announcement-${a.id}`,
      icon: "📢",
      title: "Nuevo comunicado",
      text: a.text,
      date: a.created_at,
    })),
    ...photos.map((p) => ({
      id: `photo-${p.id}`,
      icon: "📸",
      title: "Foto del día publicada",
      text: `Ya puedes ver "${p.title}" en la galería.`,
      date: p.created_at,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(items);
});
