import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { mapChild } from "../mappers.js";

export const childrenRouter = Router();

childrenRouter.get("/me", auth, async (req, res) => {
  const [[child]] = await pool.query(
    `SELECT c.* FROM children c
     JOIN family_children fc ON fc.child_id = c.id
     WHERE fc.parent_user_id = ?
     LIMIT 1`,
    [req.user.id]
  );

  res.json(child ? mapChild(child) : null);
});

childrenRouter.get("/:id", auth, requireRole("educadora"), async (req, res) => {
  const [[child]] = await pool.query("SELECT * FROM children WHERE id = ?", [
    req.params.id,
  ]);

  if (!child) return res.status(404).json({ error: "Niño no encontrado." });

  const [history] = await pool.query(
    "SELECT * FROM child_status_log WHERE child_id = ? ORDER BY created_at DESC LIMIT 10",
    [req.params.id]
  );

  res.json({
    ...mapChild(child),
    history: history.map((h) => ({
      id: h.id,
      status: h.status,
      statusIcon: h.status_icon,
      note: h.note,
      createdAt: h.created_at,
    })),
  });
});

childrenRouter.put("/:id", auth, requireRole("educadora"), async (req, res) => {
  const { status, statusIcon, snack, nap, teacherComment, note } = req.body;

  await pool.query(
    `UPDATE children SET
       status = COALESCE(?, status),
       status_icon = COALESCE(?, status_icon),
       snack = COALESCE(?, snack),
       nap = COALESCE(?, nap),
       teacher_comment = COALESCE(?, teacher_comment)
     WHERE id = ?`,
    [status, statusIcon, snack, nap, teacherComment, req.params.id]
  );

  if (status) {
    await pool.query(
      "INSERT INTO child_status_log (child_id, status, status_icon, note) VALUES (?, ?, ?, ?)",
      [req.params.id, status, statusIcon || "⭐", note || teacherComment || null]
    );
  }

  const [[child]] = await pool.query("SELECT * FROM children WHERE id = ?", [
    req.params.id,
  ]);

  res.json(mapChild(child));
});
