import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";

function Calendario() {
  const { events } = useApp();
  const nextEvent = events[0];

  return (
    <div className="calendar-page">
      <PageHeader eyebrow="Actividades y fechas" title="Agenda" />

      {nextEvent && (
        <section className="agenda-hero">
          <p>Próximo evento</p>
          <h2>{nextEvent.title}</h2>
          <span>Evento programado</span>
        </section>
      )}

      <section className="calendar-strip">
        {events.slice(0, 4).map((event, index) => (
          <div className={index === 0 ? "active" : ""} key={event.id}>
            <strong>{event.day}</strong>
            <span>{event.month}</span>
          </div>
        ))}
      </section>

      <section className="agenda-list">
        <p className="section-title">Eventos del mes</p>

        {events.map((event) => (
          <article className="agenda-item" key={event.id}>
            <div className="agenda-date">
              <strong>{event.day}</strong>
              <span>{event.month}</span>
            </div>

            <div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>

              {event.confirm && (
                <button className="small-button">Confirmar asistencia</button>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Calendario;