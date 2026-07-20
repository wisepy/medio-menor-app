import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";

function Mas() {
  const { user } = useApp();

  const roleLabel = user?.role === "educadora" ? "Educadora" : "Apoderado";

  return (
    <div className="more-page">
      <PageHeader eyebrow="Herramientas del curso" title="Más" />

      <section className="more-profile-card">
        <div className="more-profile-avatar">👨‍👩‍👦</div>

        <div>
          <h3>{user?.name}</h3>
          <p>{roleLabel} · Medio Menor</p>
        </div>

        <Link to="/perfil">Ver</Link>
      </section>

      <section className="more-section">
        <p className="section-title">Gestión del curso</p>

        <div className="more-list">
          {user?.role === "educadora" && (
            <Link to="/admin">
              <span>👩‍🏫</span>
              <div>
                <h3>Panel Educadora</h3>
                <p>Publicar comunicados, fotos y registros</p>
              </div>
            </Link>
          )}

          <Link to="/tesoreria">
            <span>💰</span>
            <div>
              <h3>Tesorería</h3>
              <p>Saldos, ingresos y rendiciones</p>
            </div>
          </Link>

          <Link to="/votaciones">
            <span>📊</span>
            <div>
              <h3>Votaciones</h3>
              <p>Decisiones de apoderados</p>
            </div>
          </Link>

          <Link to="/documentos">
            <span>📄</span>
            <div>
              <h3>Documentos</h3>
              <p>Actas, autorizaciones y archivos</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="more-section">
        <p className="section-title">Comunidad</p>

        <div className="more-list">
          <Link to="/comunidad">
            <span>👥</span>
            <div>
              <h3>Comunidad</h3>
              <p>Familias, talentos y colaboración</p>
            </div>
          </Link>

          <Link to="/marketplace">
            <span>🛒</span>
            <div>
              <h3>Marketplace</h3>
              <p>Uniformes, libros y materiales</p>
            </div>
          </Link>

          <Link to="/notificaciones">
            <span>🔔</span>
            <div>
              <h3>Notificaciones</h3>
              <p>Avisos, fotos y cambios importantes</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Mas;
