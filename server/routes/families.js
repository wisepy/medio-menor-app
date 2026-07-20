import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { mapChild } from "../mappers.js";

export const familiesRouter = Router();

familiesRouter.get("/", auth, requireRole("educadora"), async (req, res) => {
  const [parents] = await pool.query(
    "SELECT id, name, email FROM users WHERE role = 'apoderado' ORDER BY name"
  );

  const [children] = await pool.query(
    `SELECT c.id, c.name, fc.parent_user_id FROM children c
     JOIN family_children fc ON fc.child_id = c.id`
  );

  const [directiva] = await pool.query("SELECT user_id, role FROM directiva_roles");

  const families = parents.map((parent) => ({
    id: parent.id,
    name: parent.name,
    email: parent.email,
    directivaRole: directiva.find((d) => d.user_id === parent.id)?.role || null,
    children: children
      .filter((c) => c.parent_user_id === parent.id)
      .map((c) => ({ id: c.id, name: c.name })),
  }));

  const [[childCount]] = await pool.query("SELECT COUNT(*) AS total FROM children");

  res.json({
    stats: {
      families: families.length,
      children: childCount.total,
      directiva: directiva.length,
    },
    families,
  });
});

familiesRouter.get("/:id", auth, requireRole("educadora"), async (req, res) => {
  const [[parent]] = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [req.params.id]
  );

  if (!parent) return res.status(404).json({ error: "Familia no encontrada." });

  const [children] = await pool.query(
    `SELECT c.* FROM children c
     JOIN family_children fc ON fc.child_id = c.id
     WHERE fc.parent_user_id = ?`,
    [req.params.id]
  );

  const [[directiva]] = await pool.query(
    "SELECT role FROM directiva_roles WHERE user_id = ?",
    [req.params.id]
  );

  res.json({
    ...parent,
    directivaRole: directiva?.role || null,
    children: children.map(mapChild),
  });
});

familiesRouter.post("/", auth, requireRole("educadora"), async (req, res) => {
  const { parentName, parentEmail, password, childName } = req.body;

  if (!parentName || !parentEmail || !password || !childName) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const passwordHash = await bcrypt.hash(password, 10);

    const [parentResult] = await connection.query(
      "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'apoderado')",
      [parentEmail.trim().toLowerCase(), passwordHash, parentName]
    );

    const [childResult] = await connection.query(
      "INSERT INTO children (name) VALUES (?)",
      [childName]
    );

    await connection.query(
      "INSERT INTO family_children (parent_user_id, child_id) VALUES (?, ?)",
      [parentResult.insertId, childResult.insertId]
    );

    await connection.commit();
    res.status(201).json({ parentId: parentResult.insertId, childId: childResult.insertId });
  } catch (error) {
    await connection.rollback();

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Ese correo ya está registrado." });
    }

    throw error;
  } finally {
    connection.release();
  }
});
