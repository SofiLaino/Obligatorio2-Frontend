import React, { useState, useEffect } from "react";
import "../GestionVentas/css/GestionVentas.css";
import { useNavigate } from "react-router-dom";

const VentasPorUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const navigate = useNavigate();

  // Obtener la lista de usuarios al cargar el componente
  useEffect(() => {
    fetch("http://localhost:5008/usuarios")
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al cargar usuarios:", error));
  }, []);

  // Obtener ventas del usuario seleccionado
  const obtenerVentas = (usuarioId) => {
    fetch(`http://localhost:5008/usuarios/${usuarioId}/ventas`)
      .then((response) => {
        if (response.status === 204) {
          setVentas([]); // Sin ventas para este usuario
        } else {
          return response.json();
        }
      })
      .then((data) => setVentas(data || []))
      .catch((error) => console.error("Error al cargar ventas:", error));
  };

  return (
    <div className="gestion-ventas-container">
      <button className="volver" onClick={() => navigate(-1)}>Volver</button>
      <h1>Ventas por Usuario</h1>
      <label htmlFor="usuario">Seleccionar Usuario:</label>
      <select
        id="usuario"
        onChange={(e) => {
          const usuarioId = e.target.value;
          setUsuarioSeleccionado(usuarioId);
          obtenerVentas(usuarioId);
        }}
      >
        <option value="">Selecciona un Usuario</option>
        {usuarios.map((usuario) => (
          <option key={usuario.id} value={usuario.id}>
            {usuario.nombre} {usuario.apellido}
          </option>
        ))}
      </select>

      <h2>Compras:</h2>
      {ventas.length > 0 ? (
        ventas.map((venta) => {
          // Calcular el total de la compra sumando el precio de cada videojuego * cantidad
          const totalCompra = venta.videojuegoVentas.reduce((total, v) => {
            return total + (v.precio * v.cantidad);
          }, 0);

          return (
            <div key={venta.id}>
              <h3>Fecha de Compra: {venta.fechaCompra}</h3>
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
        <p>No hay ventas para este usuario.</p>
      )}
    </div>
  );
};

export default VentasPorUsuario;
