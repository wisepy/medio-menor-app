import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";

function Marketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function loadListings() {
    return api.get("/api/marketplace").then(setListings);
  }

  useEffect(() => {
    loadListings()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit() {
    if (!title.trim()) {
      setError("Debes escribir un título.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await api.post("/api/marketplace", { title, description, price: price || null });
      await loadListings();
      setTitle("");
      setDescription("");
      setPrice("");
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div className="marketplace-page">
      <PageHeader eyebrow="Intercambio entre familias" title="Marketplace" />

      <button className="treasury-new-button" onClick={() => setShowForm((v) => !v)}>
        ➕ {showForm ? "Cancelar" : "Publicar artículo"}
      </button>

      {showForm && (
        <section className="child-card">
          <form className="teacher-form">
            <label>Título</label>
            <input
              type="text"
              placeholder="Ej: Uniforme talla 4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Descripción</label>
            <input
              type="text"
              placeholder="Ej: Buen estado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label>Precio (opcional)</label>
            <input
              type="number"
              placeholder="Ej: 8000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            {error && <p className="login-error">{error}</p>}

            <button
              type="button"
              className="primary-button"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Publicando..." : "Publicar"}
            </button>
          </form>
        </section>
      )}

      {listings.map((item) => (
        <section className="market-item" key={item.id}>
          <div className="market-image">{item.emoji}</div>

          <div>
            <h3>{item.title}</h3>
            <p>
              {item.description}
              {item.price ? ` · $${Number(item.price).toLocaleString("es-CL")}` : ""}
            </p>
            <span>Publicado por {item.seller}</span>
          </div>
        </section>
      ))}
    </div>
  );
}

export default Marketplace;
