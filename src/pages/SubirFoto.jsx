import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";

function SubirFoto() {
  const navigate = useNavigate();
  const { addPhoto } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleImageChange(event) {
    const selected = event.target.files[0];

    if (!selected) return;

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      setError("Debes escribir título y descripción.");
      return;
    }

    if (!file) {
      setError("Debes subir una fotografía.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await addPhoto({ title, description, file });
      navigate("/fotos");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <PageHeader eyebrow="Contenido diario" title="Foto del día" />

      <section className="child-card">
        <form className="teacher-form">
          <label>Título</label>
          <input
            type="text"
            placeholder="Ej: Exploración sensorial"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Descripción</label>
          <textarea
            rows="4"
            placeholder="Describe la actividad..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Fotografía</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Vista previa" />
            </div>
          )}

          {error && <p className="login-error">{error}</p>}

          <button
            type="button"
            className="primary-button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Publicando..." : "Publicar foto"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default SubirFoto;
