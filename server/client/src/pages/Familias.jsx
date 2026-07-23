import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Link } from "react-router-dom";
import { api } from "../api/client";

function Familias() {
  const [data, setData] = useState({ stats: { families: 0, children: 0, directiva: 0 }, families: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [childName, setChildName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function loadFamilies() {
    return api.get("/api/families").then(setData);
  }

  useEffect(() => {
    loadFamilies()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit() {
    if (!parentName.trim() || !parentEmail.trim() || !password.trim() || !childName.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await api.post("/api/families", { parentName, parentEmail, password, childName });
      await loadFamilies();
      setParentName("");
      setParentEmail("");
      setPassword("");
      setChildName("");
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div className="familias-page">
      <PageHeader eyebrow="Administración" title="Familias" />

      <section className="familias-stats">
        <div>
          <strong>{data.stats.families}</strong>
          <span>Familias</span>
        </div>

        <div>
          <strong>{data.stats.children}</strong>
          <span>Niños</span>
        </div>

        <div>
          <strong>{data.stats.directiva}</strong>
          <span>Directiva</span>
        </div>
      </section>

      <button className="primary-button" onClick={() => setShowForm((v) => !v)}>
        ➕ {showForm ? "Cancelar" : "Agregar familia"}
      </button>

      {showForm && (
        <section className="child-card">
          <form className="teacher-form">
            <label>Nombre apoderado</label>
            <input
              type="text"
              placeholder="Ej: María Pérez"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
            />

            <label>Correo</label>
            <input
              type="email"
              placeholder="Ej: maria@email.com"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
            />

            <label>Contraseña inicial</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Nombre del niño/a</label>
            <input
              type="text"
              placeholder="Ej: Sofía"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
            />

            {error && <p className="login-error">{error}</p>}

            <button
              type="button"
              className="primary-button"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Guardando..." : "Guardar familia"}
            </button>
          </form>
        </section>
      )}

      {data.families.map((family) => (
        <section className="family-card" key={family.id}>
          <div className="family-avatar">👨‍👩‍👦</div>

          <div>
            <h3>{family.name}</h3>
            <p>{family.children.map((c) => c.name).join(", ") || "Sin niños asociados"}</p>
          </div>

          <Link to={`/familia/${family.id}`}>Ver</Link>
        </section>
      ))}
    </div>
  );
}

export default Familias;
