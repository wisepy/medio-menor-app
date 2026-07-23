import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useApp } from "../context/AppContext";

function Home() {
  const { user, child, notifications } = useApp();

  if (!child) {
    return (
      <div className="home-page">
        <header className="home-hero-new">
          <div className="hero-top">
            <div>
              <p className="eyebrow">Hola, {user?.name} 👋</p>
              <h1>Medio Menor</h1>
              <p>Panel de la educadora</p>
            </div>

            <div className="child-mini-avatar">👩‍🏫</div>
          </div>

          <Link to="/notificaciones" className="hero-alert">
            <span>🔔</span>
            <div>
              <strong>{notifications.unread} novedades nuevas</strong>
              <p>Revisa comunicados, fotos y eventos</p>
            </div>
          </Link>
        </header>

        <section className="home-grid">
          <Link to="/admin" className="home-card horizontal">
            <span>👩‍🏫</span>
            <div>
              <h3>Panel educadora</h3>
              <p>Gestionar el curso</p>
            </div>
          </Link>

          <Link to="/familias" className="home-card horizontal">
            <span>👨‍👩‍👧‍👦</span>
            <div>
              <h3>Familias</h3>
              <p>Ver apoderados y niños</p>
            </div>
          </Link>

          <Link to="/comunicados" className="home-card horizontal">
            <span>📢</span>
            <div>
              <h3>Comunicados</h3>
              <p>Publicar avisos</p>
            </div>
          </Link>

          <Link to="/tesoreria" className="home-card horizontal">
            <span>💰</span>
            <div>
              <h3>Tesorería</h3>
              <p>Saldo y rendiciones</p>
            </div>
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="home-page">

      <header className="home-hero-new">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Hola, familia de {child.name} 👋</p>
            <h1>Medio Menor</h1>
            <p>{child.garden}</p>
          </div>

          <div className="child-mini-avatar">👶</div>
        </div>

        <Link to="/notificaciones" className="hero-alert">
          <span>🔔</span>
          <div>
            <strong>{notifications.unread} novedades nuevas</strong>
            <p>Revisa comunicados, fotos y eventos</p>
          </div>
        </Link>
      </header>

      <Card className="today-summary">
        <div>
          <p className="section-title">Resumen de hoy</p>
          <h2>
            Todo va {child.status.toLowerCase()} {child.statusIcon}
          </h2>
          <p>{child.name} participó feliz, comió bien y tuvo una buena siesta.</p>
        </div>
      </Card>

      <section className="quick-actions">
        <Link to="/mi-hijo">
          <span>👶</span>
          Mi hijo
        </Link>

        <Link to="/fotos">
          <span>📸</span>
          Foto
        </Link>

        <Link to="/comunicados">
          <span>📢</span>
          Avisos
        </Link>
      </section>

      <section className="daily-status">
        <p className="section-title">¿Cómo estuvo hoy?</p>

        <div className="status-box">
          <div className="status-icon">{child.statusIcon}</div>

          <div>
            <h3>{child.status}</h3>
            <p>Participó feliz en las actividades del día.</p>
          </div>
        </div>
      </section>

      <section className="home-grid">
        <Link to="/fotos" className="home-card horizontal">
          <span>📸</span>
          <div>
            <h3>Foto del día</h3>
            <p>Ver momento destacado</p>
          </div>
        </Link>

        <Link to="/comunicados" className="home-card horizontal">
          <span>📢</span>
          <div>
            <h3>Comunicados</h3>
            <p>{notifications.unread} aviso nuevo</p>
          </div>
        </Link>

        <Link to="/calendario" className="home-card horizontal">
          <span>📅</span>
          <div>
            <h3>Agenda</h3>
            <p>Próximo evento</p>
          </div>
        </Link>

        <Link to="/tesoreria" className="home-card horizontal">
          <span>💰</span>
          <div>
            <h3>Tesorería</h3>
            <p>Saldo y rendiciones</p>
          </div>
        </Link>
      </section>

    </div>
  );
}

export default Home;
