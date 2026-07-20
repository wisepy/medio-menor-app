import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

export const votesRouter = Router();

async function buildVoteResponse(vote, userId) {
  const [options] = await pool.query(
    "SELECT * FROM vote_options WHERE vote_id = ?",
    [vote.id]
  );

  const [counts] = await pool.query(
    "SELECT option_id, COUNT(*) AS total FROM vote_records WHERE vote_id = ? GROUP BY option_id",
    [vote.id]
  );

  const totalVotes = counts.reduce((sum, c) => sum + c.total, 0);

  const [[myVote]] = await pool.query(
    "SELECT option_id FROM vote_records WHERE vote_id = ? AND user_id = ?",
    [vote.id, userId]
  );

  return {
    id: vote.id,
    title: vote.title,
    status: vote.status,
    closesLabel: vote.closes_label,
    hasVoted: !!myVote,
    myOptionId: myVote ? myVote.option_id : null,
    options: options.map((option) => {
      const count = counts.find((c) => c.option_id === option.id)?.total || 0;

      return {
        id: option.id,
        icon: option.icon,
        label: option.label,
        percentage: totalVotes ? Math.round((count / totalVotes) * 100) : 0,
      };
    }),
  };
}

votesRouter.get("/active", auth, async (req, res) => {
  const [[vote]] = await pool.query(
    "SELECT * FROM votes WHERE active = 1 ORDER BY created_at DESC LIMIT 1"
  );

  if (!vote) return res.json(null);

  res.json(await buildVoteResponse(vote, req.user.id));
});

votesRouter.post("/:id/vote", auth, async (req, res) => {
  const { optionId } = req.body;

  if (!optionId) {
    return res.status(400).json({ error: "Debes elegir una opción." });
  }

  await pool.query(
    `INSERT INTO vote_records (vote_id, option_id, user_id) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE option_id = VALUES(option_id)`,
    [req.params.id, optionId, req.user.id]
  );

  const [[vote]] = await pool.query("SELECT * FROM votes WHERE id = ?", [
    req.params.id,
  ]);

  res.json(await buildVoteResponse(vote, req.user.id));
});

votesRouter.post("/", auth, requireRole("educadora"), async (req, res) => {
  const { title, closesLabel, options } = req.body;

  if (!title || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: "Título y al menos 2 opciones son obligatorios." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query("UPDATE votes SET active = 0 WHERE active = 1");

    const [result] = await connection.query(
      "INSERT INTO votes (title, closes_label, active) VALUES (?, ?, 1)",
      [title, closesLabel || null]
    );

    for (const option of options) {
      await connection.query(
        "INSERT INTO vote_options (vote_id, icon, label) VALUES (?, ?, ?)",
        [result.insertId, option.icon || "🗳️", option.label]
      );
    }

    await connection.commit();
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});
