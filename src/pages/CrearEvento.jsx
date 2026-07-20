import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";

function CrearEvento() {
  const navigate = useNavigate();
  const { addEvent } = useApp();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [confirm, setConfirm] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !date || !description.trim()) {
      setError("Debes completar nombre, fecha y descripción.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await addEvent({ title, date, time, description, confirm });
      navigate("/calendario");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <PageHeader eyebrow="Calendario" title="Nuevo evento" />

      <section className="child-card">
        <form className="teacher-form">
          <label>Nombre evento</label>
          <input
            type="text"
            placeholder="Ej: Día del Niño"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Hora</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <label>Descripción</label>
          <textarea
            rows="4"
            placeholder="Detalles del evento..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>¿Requiere confirmar asistencia?</label>
          <select
            value={confirm ? "si" : "no"}
            onChange={(e) => setConfirm(e.target.value === "si")}
          >
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>

          {error && <p className="login-error">{error}</p>}

          <button
            type="button"
            className="primary-button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Creando..." : "Crear evento"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default CrearEvento;
