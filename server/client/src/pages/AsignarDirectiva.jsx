import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";

const ROLES = [
  { value: "presidente", label: "👑 Presidente/a" },
  { value: "tesorera", label: "💰 Tesorera" },
  { value: "secretario", label: "📝 Secretario/a" },
];

function AsignarDirectiva() {
  const [data, setData] = useState({ current: [], candidates: [] });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("presidente");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    return api.get("/api/directiva").then((result) => {
      setData(result);
      setSelectedUserId((prev) => prev ?? result.candidates[0]?.id ?? null);
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    if (!selectedUserId) return;

    setSaving(true);
    setError("");

    try {
      await api.post("/api/directiva", { userId: selectedUserId, role: selectedRole });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="directive-page">
      <PageHeader eyebrow="Permisos del curso" title="Asignar directiva" />

      <section className="child-card">
        <p className="section-title">Seleccionar apoderado</p>

        <div className="directive-family-list">
          {data.candidates.map((candidate) => (
            <label key={candidate.id}>
              <input
                type="radio"
                name="apoderado"
                checked={selectedUserId === candidate.id}
                onChange={() => setSelectedUserId(candidate.id)}
              />
              <span>👨‍👩‍👦</span>
              <div>
                <h3>{candidate.name}</h3>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="child-card">
        <p className="section-title">Asignar cargo</p>

        <div className="role-options">
          {ROLES.map((role) => (
            <button
              key={role.value}
              className={selectedRole === role.value ? "active" : ""}
              type="button"
              onClick={() => setSelectedRole(role.value)}
            >
              {role.label}
            </button>
          ))}
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="primary-button" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cargo"}
        </button>
      </section>

      <section className="child-card">
        <p className="section-title">Directiva actual</p>

        <div className="directive-list">
          {data.current.map(({ role, holder }) => (
            <div key={role}>
              <span>
                {role === "presidente" ? "👑" : role === "tesorera" ? "💰" : "📝"}
              </span>
              <div>
                <h3>
                  {role === "presidente"
                    ? "Presidente/a"
                    : role === "tesorera"
                    ? "Tesorera"
                    : "Secretario/a"}
                </h3>
                <p>{holder ? holder.name : "Sin asignar"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AsignarDirectiva;
