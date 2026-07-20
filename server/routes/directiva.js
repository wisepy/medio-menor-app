import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

export const directivaRouter = Router();

directivaRouter.get("/", auth, async (req, res) => {
  const [holders] = await pool.query(
    `SELECT d.role, u.id AS userId, u.name FROM directiva_roles d
     JOIN users u ON u.id = d.user_id`
  );

  const [candidates] = await pool.query(
    "SELECT id, name FROM users WHERE role = 'apoderado' ORDER BY name"
  );

  const roles = ["presidente", "tesorera", "secretario"];

  res.json({
    current: roles.map((role) => ({
      role,
      holder: holders.find((h) => h.role === role) || null,
    })),
    candidates,
  });
});

directivaRouter.post("/", auth, requireRole("educadora"), async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !["presidente", "tesorera", "secretario"].includes(role)) {
    return res.status(400).json({ error: "Usuario y cargo válido son obligatorios." });
  }

  await pool.query(
    `INSERT INTO directiva_roles (user_id, role) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), assigned_at = CURRENT_TIMESTAMP`,
    [userId, role]
  );

  res.status(201).json({ role, userId });
});
