import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";

function MiHijo() {
  const { child } = useApp();

  if (!child) {
    return (
      <div className="child-page">
        <PageHeader eyebrow="Seguimiento diario" title="Mi hijo" />
        <p>No tienes un niño asociado a tu cuenta.</p>
      </div>
    );
  }

  return (
    <div className="child-page">

      <PageHeader eyebrow="Seguimiento diario" title="Mi hijo" />

      <section className="child-profile-hero">
        <div className="child-big-avatar">👶</div>

        <div>
          <p>Familia de</p>
          <h1>{child.name}</h1>
          <span>{child.course} · {child.garden}</span>
        </div>
      </section>

      <section className="daily-metrics">
        <div>
          <span>{child.statusIcon}</span>
          <strong>{child.status}</strong>
          <p>Estado</p>
        </div>

        <div>
          <span>🍎</span>
          <strong>{child.snack || "Sin registro"}</strong>
          <p>Colación</p>
        </div>

        <div>
          <span>😴</span>
          <strong>{child.nap || "Sin registro"}</strong>
          <p>Siesta</p>
        </div>
      </section>

      <section className="child-card">
        <p className="section-title">Comentario Educadora</p>
        <p>{child.teacherComment || "Aún no hay comentarios del día."}</p>
      </section>

      {child.activityTitle && (
        <section className="child-card">
          <p className="section-title">Actividad Destacada</p>

          <div className="activity-box">
            <div>🎨</div>

            <div>
              <h3>{child.activityTitle}</h3>
              <p>{child.activityDescription}</p>
            </div>
          </div>
        </section>
      )}

      <section className="child-card">
        <p className="section-title">Registro del día</p>

        <div className="daily-log">
          <div>
            <span>🍎</span>
            <p>{child.snack || "Sin registro"}</p>
          </div>

          <div>
            <span>😴</span>
            <p>{child.nap || "Sin registro"}</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default MiHijo;
