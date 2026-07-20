import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";

function Tesoreria() {
  const { treasury } = useApp();

  return (
    <div className="treasury-page">
      <PageHeader eyebrow="Directiva del curso" title="Tesorería" />

      <section className="finance-hero">
        <p>Saldo disponible</p>
        <h1>{treasury.balance}</h1>

        <div className="finance-resume">
          <div>
            <span>Ingresos</span>
            <strong>{treasury.raised}</strong>
          </div>

          <div>
            <span>Gastos</span>
            <strong>{treasury.spent}</strong>
          </div>
        </div>
      </section>

      <Link to="/tesoreria/nuevo" className="treasury-new-button">
        ➕ Registrar ingreso o gasto
      </Link>

      {treasury.fund && (
        <section className="finance-fund">
          <div className="fund-circle">
            {treasury.fund.progress}%
          </div>

          <div>
            <p className="section-title">Fondo activo</p>
            <h3>{treasury.fund.name}</h3>
            <p>{treasury.fund.current} de {treasury.fund.goal}</p>
          </div>
        </section>
      )}

      <section className="finance-movements">
        <p className="section-title">Últimos movimientos</p>

        {treasury.movements.map((movement) => (
          <article className={`finance-row ${movement.type}`} key={movement.id}>
            <div>
              <h3>{movement.title}</h3>
              <p>{movement.detail}</p>
            </div>

            <strong>{movement.amount}</strong>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Tesoreria;