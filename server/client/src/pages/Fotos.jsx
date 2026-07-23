import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";
import { resolveAssetUrl } from "../api/client";

function Fotos() {
  const { dailyPhoto, photos, likeDailyPhoto } = useApp();

  if (!dailyPhoto) {
    return (
      <div className="photo-page">
        <PageHeader eyebrow="Momento destacado" title="Foto del día" />
        <p>Aún no hay fotos publicadas.</p>
      </div>
    );
  }

  return (
    <div className="photo-page">
      <PageHeader eyebrow="Momento destacado" title="Foto del día" />

      <section className="photo-premium-card">
        <div className="photo-visual">
          <div className="photo-badge">📸 {dailyPhoto.date}</div>

          {dailyPhoto.imageUrl ? (
            <img src={resolveAssetUrl(dailyPhoto.imageUrl)} alt={dailyPhoto.title} />
          ) : (
            <div className="photo-emoji">🎨</div>
          )}
        </div>

        <div className="photo-content">
          <p className="section-title">{dailyPhoto.activity}</p>
          <h2>{dailyPhoto.title}</h2>
          <p>{dailyPhoto.description}</p>

          <div className="photo-actions">
            <button className="primary-button" onClick={likeDailyPhoto}>
              ❤️ Me encanta
            </button>
            <span>{dailyPhoto.likes} familias</span>
          </div>
        </div>
      </section>

      <section className="child-card">
        <p className="section-title">Galería reciente</p>

        <div className="premium-gallery">
          {photos.map((photo) => (
            <div key={photo.id}>
              {photo.imageUrl ? (
                <img src={resolveAssetUrl(photo.imageUrl)} alt={photo.title} />
              ) : (
                <span>{photo.emoji}</span>
              )}

              <p>{photo.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Fotos;
