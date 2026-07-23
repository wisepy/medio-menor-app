import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";
import { useApp } from "../context/AppContext";

function Admin() {
  const { announcements, dailyPhoto } = useApp();
  const [directiva, setDirectiva] = useState({ current: [] });

  useEffect(() => {
    api.get("/api/directiva").then(setDirectiva);
  }, []);

  const totalReads = announcements.filter((a) => a.status === "Leído").length;

  return (
    <div className="admin-page">
      <PageHeader eyebrow="Panel de gestión" title="Educadora" />

      <section className="admin-hero">
        <div>
          <p>Hoy puedes actualizar</p>
          <h2>Información del curso</h2>
        </div>

        <span>👩‍🏫</span>
      </section>

      <section className="admin-dashboard">
        <div>
          <strong>{announcements.length}</strong>
          <span>Comunicados</span>
        </div>

        <div>
          <strong>{dailyPhoto ? 1 : 0}</strong>
          <span>Foto hoy</span>
        </div>

        <div>
          <strong>{totalReads}</strong>
          <span>Lecturas</span>
        </div>
      </section>

      <section className="admin-group">
        <p className="section-title">Familias y niños</p>

        <div className="admin-group-list">
          <Link to="/familias">
            <span>👨‍👩‍👧‍👦</span>
            <div>
              <h3>Gestionar familias</h3>
              <p>Apoderados, niños y datos del curso</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="admin-group">
        <p className="section-title">Comunicaciones</p>

        <div className="admin-group-list">
          <Link to="/admin/comunicado">
            <span>📢</span>
            <div>
              <h3>Crear comunicado</h3>
              <p>Avisos, recordatorios y emergencias</p>
            </div>
          </Link>

          <Link to="/admin/foto">
            <span>📸</span>
            <div>
              <h3>Subir foto del día</h3>
              <p>Momento destacado para las familias</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="admin-group">
        <p className="section-title">Agenda y organización</p>

        <div className="admin-group-list">
          <Link to="/admin/evento">
            <span>📅</span>
            <div>
              <h3>Crear evento</h3>
              <p>Reuniones, celebraciones y actividades</p>
            </div>
          </Link>

          <Link to="/admin/votacion">
            <span>📊</span>
            <div>
              <h3>Votaciones</h3>
              <p>Decisiones del curso</p>
            </div>
          </Link>
        </div>

        <Link to="/admin/directiva">
          <span>👥</span>
          <div>
            <h3>Asignar directiva</h3>
            <p>Presidente, tesorera y secretario</p>
          </div>
        </Link>
      </section>

      <section className="admin-group">
        <p className="section-title">Directiva del curso</p>

        <div className="directive-list">
          {directiva.current.map(({ role, holder }) => (
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
              <Link to="/admin/directiva" className="small-link-button">
                Asignar
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Admin;
