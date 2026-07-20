import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

export const marketplaceRouter = Router();

marketplaceRouter.get("/", auth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT m.*, u.name AS sellerName FROM marketplace_listings m
     JOIN users u ON u.id = m.user_id
     ORDER BY m.created_at DESC`
  );

  res.json(
    rows.map((row) => ({
      id: row.id,
      emoji: row.emoji,
      title: row.title,
      description: row.description,
      price: row.price,
      seller: row.sellerName,
    }))
  );
});

marketplaceRouter.post("/", auth, async (req, res) => {
  const { title, description, price, emoji } = req.body;

  if (!title) {
    return res.status(400).json({ error: "El título es obligatorio." });
  }

  const [result] = await pool.query(
    "INSERT INTO marketplace_listings (user_id, emoji, title, description, price) VALUES (?, ?, ?, ?, ?)",
    [req.user.id, emoji || "🛒", title, description || null, price || null]
  );

  res.status(201).json({ id: result.insertId });
});
