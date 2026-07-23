import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";

const STATUS_OPTIONS = [
  { label: "Excelente", icon: "⭐" },
  { label: "Bien", icon: "🙂" },
  { label: "Necesitó apoyo", icon: "🧡" },
];

function NinoDetalle() {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [status, setStatus] = useState("Excelente");
  const [snack, setSnack] = useState("");
  const [nap, setNap] = useState("");
  const [teacherComment, setTeacherComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function load() {
    return api.get(`/api/children/${id}`).then((data) => {
      setChild(data);
      setStatus(data.status);
      setSnack(data.snack || "");
      setNap(data.nap || "");
      setTeacherComment(data.teacherComment || "");
    });
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const statusIcon = STATUS_OPTIONS.find((o) => o.label === status)?.icon || "⭐";

      await api.put(`/api/children/${id}`, {
        status,
        statusIcon,
        snack,
        nap,
        teacherComment,
      });

      await load();
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!child) return null;

  return (
    <div className="child-detail-page">
      <PageHeader eyebrow="Ficha diaria" title={child.name} />

      <section className="child-detail-hero">
        <div className="child-detail-avatar">👶</div>

        <div>
          <h2>{child.name}</h2>
          <p>{child.course} · {child.garden}</p>
          <span>Activo</span>
        </div>
      </section>

      <section className="child-card">
        <p className="section-title">Actualizar estado del día</p>

        <div className="status-options">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.label}
              className={status === option.label ? "active" : ""}
              type="button"
              onClick={() => setStatus(option.label)}
            >
              {option.icon} {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="child-card">
        <p className="section-title">Registro diario</p>

        <div className="teacher-form">
          <label>Colación</label>
          <select value={snack} onChange={(e) => setSnack(e.target.value)}>
            <option>Comió toda la colación</option>
            <option>Comió parcialmente</option>
            <option>No quiso comer</option>
          </select>

          <label>Siesta</label>
          <input
            type="text"
            placeholder="Ej: Durmió 1 hora 25 minutos"
            value={nap}
            onChange={(e) => setNap(e.target.value)}
          />

          <label>Comentario educadora</label>
          <textarea
            rows="4"
            value={teacherComment}
            onChange={(e) => setTeacherComment(e.target.value)}
          ></textarea>

          {error && <p className="login-error">{error}</p>}
          {saved && <p className="vote-confirmation">✅ Actualización guardada</p>}

          <button
            className="primary-button"
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar actualización"}
          </button>
        </div>
      </section>

      <section className="child-card">
        <p className="section-title">Historial reciente</p>

        <div className="child-history">
          {child.history.length === 0 && <p>Sin registros anteriores.</p>}

          {child.history.map((entry) => (
            <div key={entry.id}>
              <span>{entry.statusIcon}</span>
              <div>
                <h3>{entry.status}</h3>
                <p>{entry.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default NinoDetalle;
