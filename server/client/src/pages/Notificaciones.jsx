import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";

function timeAgo(value) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Ahora";
  if (diffMinutes < 60) return `Hace ${diffMinutes} minutos`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return "Hoy";

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Ayer";

  return date.toLocaleDateString("es-CL", { day: "2-digit", month: "long" });
}

function Notificaciones() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/notifications")
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div className="notifications-page">
      <PageHeader eyebrow="Avisos recientes" title="Notificaciones" />

      {items.length === 0 && <p>No hay notificaciones por ahora.</p>}

      {items.map((item, index) => (
        <section
          className={`notification-card ${index === 0 ? "unread" : ""}`}
          key={item.id}
        >
          <span>{item.icon}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <small>{timeAgo(item.date)}</small>
          </div>
        </section>
      ))}
    </div>
  );
}

export default Notificaciones;
