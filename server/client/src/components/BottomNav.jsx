import { NavLink } from "react-router-dom";

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end>
        <span>🏠</span>
        Inicio
      </NavLink>

      <NavLink to="/calendario">
        <span>📅</span>
        Agenda
      </NavLink>

      <NavLink to="/fotos">
        <span>📸</span>
        Fotos
      </NavLink>

      <NavLink to="/mi-hijo">
        <span>👶</span>
        Mi Hijo
      </NavLink>

      <NavLink to="/mas">
        <span>☰</span>
        Más
      </NavLink>
    </nav>
  );
}

export default BottomNav;