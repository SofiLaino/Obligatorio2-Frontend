import React from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

const GestionVenta = () => {
  const navigate = useNavigate(); // Usamos el hook para navegar

  return (
    <div className="gestion-ventas-container">
  <h1>Gestión de Ventas</h1>

  <div className="button-container">
    <button onClick={() => navigate("/admin/ventasPorUsuario")}>
      Gestión Venta por Usuario
    </button>
    <button onClick={() => navigate("/admin/ventasPorFecha")}>
      Gestión Venta por Fecha
    </button>
  </div>
</div>
  );
};

export default GestionVenta;
