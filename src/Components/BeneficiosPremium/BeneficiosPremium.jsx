import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/BeneficiosPremium.css";

const BeneficiosPremium = () => {
  const navigate = useNavigate();

  return (
    <div className="premium-benefits-container">
      <h1>Beneficios de Ser Premium</h1>
      <ul className="benefits-list">
        <li>20% de descuento en todas tus compras.</li>
        <li>Acceso exclusivo a videojuegos y contenido premium.</li>
        <li>Atención al cliente prioritaria.</li>
        <li>Promociones y eventos especiales.</li>
      </ul>
      <button className="volver-button" onClick={() => navigate("/user/home")}>
        Volver al Inicio
      </button>
    </div>
  );
};

export default BeneficiosPremium;
