import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";

function CrearComunicado() {
  const navigate = useNavigate();
  const { addAnnouncement } = useApp();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [type, setType] = useState("Información general");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !text.trim()) {
      setError("Debes escribir título y mensaje.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await addAnnouncement({ title, text, type });
      navigate("/comunicados");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <PageHeader eyebrow="Nuevo aviso" title="Crear comunicado" />

      <section className="child-card">
        <form className="teacher-form">
          <label>Título</label>
          <input
            type="text"
            placeholder="Ej: Reunión de apoderados"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Mensaje</label>
          <textarea
            rows="6"
            placeholder="Escribe el comunicado para las familias..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          <label>Tipo de comunicado</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Información general</option>
            <option>Importante</option>
            <option>Emergencia</option>
            <option>Recordatorio</option>
          </select>

          {error && <p className="login-error">{error}</p>}

          <button
            className="primary-button"
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Publicando..." : "Publicar comunicado"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default CrearComunicado;
