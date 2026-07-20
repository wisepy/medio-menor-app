import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";

function CrearVotacion() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [closesLabel, setClosesLabel] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const options = [option1, option2, option3]
      .map((label) => label.trim())
      .filter(Boolean)
      .map((label) => ({ label, icon: "🗳️" }));

    if (!title.trim() || options.length < 2) {
      setError("Debes escribir la pregunta y al menos 2 opciones.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await api.post("/api/votes", { title, closesLabel, options });
      navigate("/votaciones");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <PageHeader eyebrow="Decisiones del curso" title="Crear votación" />

      <section className="child-card">
        <form className="teacher-form">
          <label>Pregunta</label>
          <input
            type="text"
            placeholder="Ej: ¿Qué regalo damos a las educadoras?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Opción 1</label>
          <input
            type="text"
            placeholder="Ej: Giftcard"
            value={option1}
            onChange={(e) => setOption1(e.target.value)}
          />

          <label>Opción 2</label>
          <input
            type="text"
            placeholder="Ej: Canasta personalizada"
            value={option2}
            onChange={(e) => setOption2(e.target.value)}
          />

          <label>Opción 3</label>
          <input
            type="text"
            placeholder="Ej: Libro + flores"
            value={option3}
            onChange={(e) => setOption3(e.target.value)}
          />

          <label>Fecha de cierre</label>
          <input
            type="date"
            onChange={(e) =>
              setClosesLabel(
                e.target.value
                  ? `Cierra el ${new Date(e.target.value).toLocaleDateString("es-CL", {
                      day: "2-digit",
                      month: "long",
                    })}`
                  : ""
              )
            }
          />

          {error && <p className="login-error">{error}</p>}

          <button
            className="primary-button"
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Publicando..." : "Publicar votación"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default CrearVotacion;
