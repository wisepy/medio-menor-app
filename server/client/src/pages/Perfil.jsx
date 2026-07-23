import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";

function Perfil() {
  const navigate = useNavigate();
  const { user, child, logout, updateProfile } = useApp();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function openEditing() {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setCurrentPassword("");
    setNewPassword("");
    setError("");
    setSuccess("");
    setEditing(true);
  }

  async function handleSave() {
    if (!name.trim() || !email.trim() || !currentPassword.trim()) {
      setError("Nombre, correo y contraseña actual son obligatorios.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      await updateProfile({ name, email, currentPassword, newPassword });
      setSuccess("Datos actualizados.");
      setCurrentPassword("");
      setNewPassword("");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-page">
      <PageHeader
        eyebrow="Cuenta y permisos"
        title="Perfil"
      />

      <section className="profile-card">
        <div className="profile-avatar">
          👨‍👩‍👦
        </div>

        <div>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
      </section>

      {child && (
        <section className="child-card">
          <p className="section-title">
            Niño asociado
          </p>

          <div className="profile-row">
            <span>👦</span>

            <div>
              <h3>{child.name}</h3>
              <p>
                {child.course} · {child.garden}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="child-card">
        <p className="section-title">
          Rol actual
        </p>

        <div className="role-badge">
          {user?.role === "educadora" ? "Educadora" : "Apoderado"}
          {user?.directivaRole ? ` · ${user.directivaRole}` : ""}
        </div>

        <p className="profile-help">
          La educadora podrá asignar
          permisos especiales como
          Presidente(a), Tesorera,
          Secretario(a) o Directiva.
        </p>
      </section>

      <section className="child-card">
        <p className="section-title">
          Datos de la cuenta
        </p>

        {!editing && (
          <>
            {success && <p className="vote-confirmation">✅ {success}</p>}
            <button className="settings-button" onClick={openEditing}>
              ✏️ Editar nombre, correo o contraseña
            </button>
          </>
        )}

        {editing && (
          <form className="teacher-form">
            <label>Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

            <label>Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>Contraseña actual</label>
            <input
              type="password"
              placeholder="Necesaria para confirmar los cambios"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <label>Nueva contraseña (opcional)</label>
            <input
              type="password"
              placeholder="Déjalo vacío para no cambiarla"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            {error && <p className="login-error">{error}</p>}

            <button
              type="button"
              className="primary-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              className="settings-button"
              onClick={() => setEditing(false)}
            >
              Cancelar
            </button>
          </form>
        )}
      </section>

      <section className="child-card">
        <p className="section-title">
          Seguridad
        </p>

        <div className="settings-list">
          <button
            className="settings-button"
            onClick={handleLogout}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </section>
    </div>
  );
}

export default Perfil;
