import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { mapChild } from "../mappers.js";

export const authRouter = Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

async function loadProfile(userId) {
  const [[user]] = await pool.query(
    "SELECT id, email, name, role FROM users WHERE id = ?",
    [userId]
  );

  if (!user) return null;

  const [[directiva]] = await pool.query(
    "SELECT role FROM directiva_roles WHERE user_id = ?",
    [userId]
  );

  const [children] = await pool.query(
    `SELECT c.* FROM children c
     JOIN family_children fc ON fc.child_id = c.id
     WHERE fc.parent_user_id = ?`,
    [userId]
  );

  return {
    ...user,
    directivaRole: directiva ? directiva.role : null,
    children: children.map(mapChild),
  };
}

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Debes ingresar correo y contraseña." });
  }

  const [[user]] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email.trim().toLowerCase(),
  ]);

  if (!user) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos." });
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos." });
  }

  const token = signToken(user);
  const profile = await loadProfile(user.id);

  res.json({ token, user: profile });
});

authRouter.get("/me", auth, async (req, res) => {
  const profile = await loadProfile(req.user.id);

  if (!profile) {
    return res.status(404).json({ error: "Usuario no encontrado." });
  }

  res.json(profile);
});
