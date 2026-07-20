import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";

function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function loadPosts() {
    return api.get("/api/community").then(setPosts);
  }

  useEffect(() => {
    loadPosts()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleLike(postId) {
    const updated = await api.post(`/api/community/${postId}/like`);
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, ...updated } : post))
    );
  }

  async function handleSubmit() {
    if (!title.trim() || !text.trim()) {
      setError("Debes escribir título y mensaje.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await api.post("/api/community", { title, text, icon: "📣" });
      await loadPosts();
      setTitle("");
      setText("");
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div className="community-page">
      <PageHeader eyebrow="Familias y participación" title="Comunidad" />

      <section className="community-composer" onClick={() => setShowForm((v) => !v)}>
        <div className="composer-avatar">👨‍👩‍👦</div>
        <div>
          <h3>Espacio privado del curso</h3>
          <p>Publicaciones moderadas por educadoras y directiva.</p>
        </div>
      </section>

      {showForm && (
        <section className="child-card">
          <form className="teacher-form">
            <label>Título</label>
            <input
              type="text"
              placeholder="Ej: Voluntarios"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Mensaje</label>
            <textarea
              rows="4"
              placeholder="Escribe tu publicación..."
              value={text}
              onChange={(e) => setText(e.target.value)}
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

      <section className="community-shortcuts">
        <div>🎂<span>Cumples</span></div>
        <div>🤝<span>Ayuda</span></div>
        <div>🎁<span>Regalos</span></div>
        <div>📣<span>Avisos</span></div>
      </section>

      {posts.map((post) => (
        <article className="social-post" key={post.id}>
          <div className="post-header">
            <div className="post-avatar">{post.icon}</div>

            <div>
              <h3>{post.title}</h3>
              <p>Publicado por directiva</p>
            </div>
          </div>

          <p className="post-text">{post.text}</p>

          <div className="post-actions">
            <button onClick={() => handleLike(post.id)}>
              {post.likedByMe ? "❤️" : "🤍"} Me gusta ({post.likeCount})
            </button>
          </div>
        </article>
      ))}

      <section className="talent-card">
        <p className="section-title">Banco de talentos</p>

        <div className="talent-list">
          <div>📸 Fotografía</div>
          <div>🎨 Diseño</div>
          <div>🚗 Transporte</div>
          <div>🧁 Repostería</div>
        </div>
      </section>
    </div>
  );
}

export default Comunidad;
