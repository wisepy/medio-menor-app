import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

function FamiliaDetalle() {
  const { id } = useParams();
  const [family, setFamily] = useState(null);

  useEffect(() => {
    api.get(`/api/families/${id}`).then(setFamily);
  }, [id]);

  if (!family) return null;

  return (
    <div className="family-detail-page">

      <PageHeader
        eyebrow="Ficha familiar"
        title={family.name}
      />

      <section className="family-profile">
        <div className="family-avatar-large">
          👨‍👩‍👦
        </div>

        <div>
          <h2>{family.name}</h2>
          <p>{family.email}</p>
          <span>Apoderado</span>
        </div>
      </section>

      {family.children.map((child) => (
        <section className="child-card" key={child.id}>
          <p className="section-title">
            Niño asociado
          </p>

          <div className="child-summary">
            <div className="child-avatar">
              👶
            </div>

            <div>
              <h3>{child.name}</h3>
              <p>{child.course}</p>
            </div>

            <Link to={`/nino/${child.id}`} className="small-link-button">
              Ver ficha
            </Link>
          </div>
        </section>
      ))}

      <section className="child-card">
        <p className="section-title">
          Roles especiales
        </p>

        <div className="role-chip">
          {family.directivaRole ? family.directivaRole : "Apoderado"}
        </div>
      </section>

    </div>
  );
}

export default FamiliaDetalle;
