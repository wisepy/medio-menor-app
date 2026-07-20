import { Router } from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

export const treasuryRouter = Router();

function formatCLP(amount) {
  return `$${Number(amount).toLocaleString("es-CL")}`;
}

async function isDirectivaOrEducadora(req) {
  if (req.user.role === "educadora") return true;

  const [[row]] = await pool.query(
    "SELECT role FROM directiva_roles WHERE user_id = ? AND role = 'tesorera'",
    [req.user.id]
  );

  return !!row;
}

treasuryRouter.get("/", auth, async (req, res) => {
  const [movements] = await pool.query(
    "SELECT * FROM treasury_movements ORDER BY created_at DESC"
  );

  const [[totals]] = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS raised,
       COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS spent
     FROM treasury_movements`
  );

  const [[fund]] = await pool.query(
    "SELECT * FROM treasury_fund ORDER BY id DESC LIMIT 1"
  );

  const balance = Number(totals.raised) - Number(totals.spent);

  res.json({
    balance: formatCLP(balance),
    raised: formatCLP(totals.raised),
    spent: formatCLP(totals.spent),
    fund: fund
      ? {
          name: fund.name,
          current: formatCLP(fund.current),
          goal: formatCLP(fund.goal),
          progress: Math.min(
            100,
            Math.round((Number(fund.current) / Number(fund.goal)) * 100)
          ),
        }
      : null,
    movements: movements.map((m) => ({
      id: m.id,
      type: m.type,
      title: m.title,
      detail: m.detail,
      amount: `${m.type === "income" ? "+" : "-"}${formatCLP(m.amount)}`,
    })),
  });
});

treasuryRouter.post("/movements", auth, async (req, res) => {
  const allowed = await isDirectivaOrEducadora(req);

  if (!allowed) {
    return res.status(403).json({ error: "Solo la directiva puede registrar movimientos." });
  }

  const { type, title, amount } = req.body;

  if (!type || !title || !amount) {
    return res.status(400).json({ error: "Tipo, título y monto son obligatorios." });
  }

  const detail = type === "income" ? "Ingreso · Directiva" : "Gasto · Directiva";

  const [result] = await pool.query(
    "INSERT INTO treasury_movements (type, title, detail, amount) VALUES (?, ?, ?, ?)",
    [type, title, detail, Number(amount)]
  );

  res.status(201).json({ id: result.insertId });
});
