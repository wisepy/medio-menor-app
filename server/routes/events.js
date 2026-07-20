import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

export const eventsRouter = Router();

eventsRouter.get("/", auth, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM events ORDER BY event_date ASC"
  );

  res.json(
    rows.map((row) => {
      const date = new Date(row.event_date);

      return {
        id: row.id,
        day: String(date.getDate()).padStart(2, "0"),
        month: date.toLocaleString("es-CL", { month: "short" }).toUpperCase(),
        title: row.title,
        description: row.description,
        confirm: !!row.confirm,
      };
    })
  );
});

eventsRouter.post("/", auth, requireRole("educadora"), async (req, res) => {
  const { title, description, date, confirm } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: "Título y fecha son obligatorios." });
  }

  const [result] = await pool.query(
    "INSERT INTO events (event_date, title, description, confirm) VALUES (?, ?, ?, ?)",
    [date, title, description || null, confirm ? 1 : 0]
  );

  res.status(201).json({ id: result.insertId });
});
