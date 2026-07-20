import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { api, resolveAssetUrl } from "../api/client";
import { useApp } from "../context/AppContext";

function Documentos() {
  const { user } = useApp();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function loadDocuments() {
    return api.get("/api/documents").then(setDocuments);
  }

  useEffect(() => {
    loadDocuments()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit() {
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (subtitle) formData.append("subtitle", subtitle);
      if (file) formData.append("file", file);

      await api.postForm("/api/documents", formData);
      await loadDocuments();
      setTitle("");
      setSubtitle("");
      setFile(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div className="documents-page">
      <PageHeader eyebrow="Biblioteca del curso" title="Documentos" />

      {user?.role === "educadora" && (
        <button className="treasury-new-button" onClick={() => setShowForm((v) => !v)}>
          ➕ {showForm ? "Cancelar" : "Subir documento"}
        </button>
      )}

      {showForm && (
        <section className="child-card">
          <form className="teacher-form">
            <label>Título</label>
            <input
              type="text"
              placeholder="Ej: Acta reunión de apoderados"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Descripción</label>
            <input
              type="text"
              placeholder="Ej: PDF · Junio"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />

            <label>Archivo</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

            {error && <p className="login-error">{error}</p>}

            <button
              type="button"
              className="primary-button"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Subiendo..." : "Subir"}
            </button>
          </form>
        </section>
      )}

      <section className="child-card">
        <p className="section-title">Archivos disponibles</p>

        {documents.map((doc) => (
          <a
            className="document-item"
            key={doc.id}
            href={doc.fileUrl ? resolveAssetUrl(doc.fileUrl) : undefined}
            target={doc.fileUrl ? "_blank" : undefined}
            rel="noreferrer"
          >
            <span>{doc.icon}</span>
            <div>
              <h3>{doc.title}</h3>
              <p>{doc.subtitle}</p>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}

export default Documentos;
