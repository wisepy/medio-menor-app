import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";

function Perfil() {
  const navigate = useNavigate();
  const { user, child, logout } = useApp();

  function handleLogout() {
    logout();
    navigate("/login");
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
