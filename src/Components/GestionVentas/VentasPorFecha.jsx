import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VentasPorFecha = () => {
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const obtenerVentasPorFecha = () => {
    if (!fechaInicio || !fechaFin) {
      setError("Por favor, selecciona ambas fechas.");
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      setError("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    setError(""); // Limpiar errores anteriores

    fetch(`http://localhost:5008/ventas/porFecha?fechaInicio=${fechaInicio}&fechafin=${fechaFin}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener ventas");
        }
        return response.json();
      })
      .then((data) => setVentas(data))
      .catch((error) => {
        console.error("Error al cargar ventas:", error);
        setError("Hubo un error al cargar las ventas. Inténtalo nuevamente.");
      });
  };

  return (
    <div className="gestion-ventas-container">
      <button className="volver" onClick={() => navigate(-1)}>Volver</button>
      <h1>Ventas por Fecha</h1>
      
      <label htmlFor="fechaInicio">Fecha de Inicio:</label>
      <input
        type="date"
        id="fechaInicio"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
      />
      
      <label htmlFor="fechaFin">Fecha de Fin:</label>
      <input
        type="date"
        id="fechaFin"
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
      />

      <button onClick={obtenerVentasPorFecha}>Buscar Ventas</button>

      {error && <p className="error">{error}</p>}

      <h2>Compras</h2>
{ventas.length > 0 ? (
  ventas.map((venta) => {
    // Calcular el total de la compra sumando cantidad * precio de cada videojuego
    const totalCompra = venta.videojuegoVentas.reduce(
      (total, v) => total + v.cantidad * v.precio,
      0
    );

    return (
      <div key={venta.id}>
        <h3>Fecha de Compra: {venta.fechaCompra}</h3>
        <p><strong>Usuario:</strong> {venta.usuario.nombre} ({venta.usuario.email})</p>
        <p>Videojuegos:</p>
        <ul>
          {venta.videojuegoVentas.map((v) => (
            <li key={v.id}>
              {v.nombre} - Cantidad: {v.cantidad} - Precio: ${v.precio}
            </li>
          ))}
        </ul>
        <h4>Total de la Compra: ${totalCompra.toFixed(2)}</h4>
      </div>
    );
  })
) : (
  <p>No hay ventas en el rango de fechas seleccionado.</p>
)}

    </div>
  );
};

export default VentasPorFecha;
