import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Debes ingresar correo y contraseña.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🐥</div>

        <p className="eyebrow">Bienvenido a</p>
        <h1>Medio Menor</h1>
        <p className="login-subtitle">My Little World</p>

        <form className="login-form">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="apoderado@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="login-error">{error}</p>}

          <button type="button" onClick={handleLogin} disabled={submitting}>
            {submitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="login-note">
          El acceso debe ser autorizado por la educadora del curso.
        </p>
      </div>
    </div>
  );
}

export default Login;
