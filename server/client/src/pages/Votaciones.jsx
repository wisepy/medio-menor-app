import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";

function Votaciones() {
  const [vote, setVote] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/votes/active")
      .then((data) => {
        setVote(data);
        setSelectedOption(data?.myOptionId || data?.options?.[0]?.id || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleVote() {
    if (!selectedOption) return;

    try {
      const updated = await api.post(`/api/votes/${vote.id}/vote`, {
        optionId: selectedOption,
      });
      setVote(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return null;

  if (!vote) {
    return (
      <div className="votes-page">
        <PageHeader eyebrow="Decisiones del curso" title="Votaciones" />
        <p>No hay votaciones activas por ahora.</p>
      </div>
    );
  }

  return (
    <div className="votes-page">
      <PageHeader eyebrow="Decisiones del curso" title="Votaciones" />

      <section className="vote-status-card">
        <p>{vote.status}</p>
        <h2>{vote.title}</h2>
        {vote.closesLabel && <span>{vote.closesLabel}</span>}
      </section>

      <section className="child-card">
        <p className="section-title">Elige una opción</p>

        {vote.options.map((option) => (
          <button
            key={option.id}
            className={`vote-option ${selectedOption === option.id ? "active" : ""}`}
            onClick={() => setSelectedOption(option.id)}
          >
            {option.icon} {option.label}
          </button>
        ))}

        <button className="primary-button" onClick={handleVote}>
          {vote.hasVoted ? "Cambiar voto" : "Enviar voto"}
        </button>

        {error && <p className="login-error">{error}</p>}

        {vote.hasVoted && (
          <p className="vote-confirmation">
            ✅ Voto registrado
          </p>
        )}
      </section>

      <section className="child-card">
        <p className="section-title">Resultados preliminares</p>

        {vote.options.map((option) => (
          <div className="vote-result" key={option.id}>
            <div>
              <span>{option.label}</span>
              <strong>{option.percentage}%</strong>
            </div>
            <div className="vote-bar">
              <span style={{ width: `${option.percentage}%` }}></span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Votaciones;
