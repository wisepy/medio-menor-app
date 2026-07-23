import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";

function formatDate(value) {
  const date = new Date(value);
  const today = new Date();

  const isToday = date.toDateString() === today.toDateString();
  if (isToday) return "Hoy";

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Ayer";

  return date.toLocaleDateString("es-CL", { day: "2-digit", month: "long" });
}

function Comunicados() {
  const { announcements, markAnnouncementRead } = useApp();

  const unreadCount = announcements.filter(
    (item) => item.status !== "Leído"
  ).length;

  return (
    <div className="announcements-page">
      <PageHeader eyebrow="Información importante" title="Comunicados" />

      <section className="announcements-summary">
        <div>
          <span>📢</span>
        </div>

        <div>
          <h2>{unreadCount} pendiente</h2>
          <p>Comunicados que requieren revisión o confirmación.</p>
        </div>
      </section>

      {announcements.map((item) => (
        <section
          key={item.id}
          className={`announcement-premium-card ${
            item.important ? "important" : ""
          }`}
          onClick={() => item.status !== "Leído" && markAnnouncementRead(item.id)}
        >
          <div className="announcement-icon">{item.icon}</div>

          <div>
            <div className="announcement-topline">
              <h3>{item.title}</h3>
              {item.important && <span>Importante</span>}
            </div>

            <p>{item.text}</p>

            <div className="announcement-footer">
              <small>{formatDate(item.date)}</small>
              <strong>{item.status}</strong>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default Comunicados;
