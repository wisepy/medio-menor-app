import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

export const communityRouter = Router();

communityRouter.get("/", auth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*,
       (SELECT COUNT(*) FROM community_post_likes l WHERE l.post_id = p.id) AS likeCount,
       (SELECT COUNT(*) FROM community_post_likes l WHERE l.post_id = p.id AND l.user_id = ?) AS likedByMe
     FROM community_posts p
     ORDER BY p.created_at DESC`,
    [req.user.id]
  );

  res.json(
    rows.map((row) => ({
      id: row.id,
      icon: row.icon,
      title: row.title,
      text: row.text,
      likeCount: row.likeCount,
      likedByMe: !!row.likedByMe,
    }))
  );
});

communityRouter.post("/", auth, async (req, res) => {
  const { title, text, icon } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: "Título y texto son obligatorios." });
  }

  const [result] = await pool.query(
    "INSERT INTO community_posts (user_id, icon, title, text) VALUES (?, ?, ?, ?)",
    [req.user.id, icon || "📣", title, text]
  );

  res.status(201).json({ id: result.insertId });
});

communityRouter.post("/:id/like", auth, async (req, res) => {
  const [[existing]] = await pool.query(
    "SELECT id FROM community_post_likes WHERE post_id = ? AND user_id = ?",
    [req.params.id, req.user.id]
  );

  if (existing) {
    await pool.query("DELETE FROM community_post_likes WHERE id = ?", [
      existing.id,
    ]);
  } else {
    await pool.query(
      "INSERT INTO community_post_likes (post_id, user_id) VALUES (?, ?)",
      [req.params.id, req.user.id]
    );
  }

  const [[{ likeCount }]] = await pool.query(
    "SELECT COUNT(*) AS likeCount FROM community_post_likes WHERE post_id = ?",
    [req.params.id]
  );

  res.json({ likeCount, likedByMe: !existing });
});
