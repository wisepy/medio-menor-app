import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";

function RegistrarMovimiento() {
  const navigate = useNavigate();
  const { addTreasuryMovement } = useApp();

  const [type, setType] = useState("income");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !amount) {
      setError("Debes completar concepto y monto.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await addTreasuryMovement({ type, title, amount });
      navigate("/tesoreria");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <PageHeader eyebrow="Tesorería" title="Nuevo movimiento" />

      <section className="child-card">
        <form className="teacher-form">
          <label>Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Ingreso</option>
            <option value="expense">Gasto</option>
          </select>

          <label>Concepto</label>
          <input
            type="text"
            placeholder="Ej: Cuota mensual"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Monto</label>
          <input
            type="number"
            placeholder="Ej: 20000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {error && <p className="login-error">{error}</p>}

          <button
            type="button"
            className="primary-button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Guardando..." : "Guardar movimiento"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default RegistrarMovimiento;
