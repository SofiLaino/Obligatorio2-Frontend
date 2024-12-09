import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "../Compras/css/Compras.css";

const Compras = () => {
  const [ventas, setVentas] = useState([]); // Estado para almacenar las ventas
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const navigate = useNavigate(); // Hook de navegación
  const userId = localStorage.getItem("userId"); // Obtener el ID del usuario

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        // Llamada a la API para obtener las ventas del usuario
        const response = await axios.get(
          `http://localhost:5008/ventas/usuarios/${userId}/ventas`
        );
        setVentas(response.data); // Almacenar las ventas en el estado
        setError(null); // Limpiar errores previos si la llamada es exitosa
      } catch (err) {
        setError("Error al cargar las compras.");
        console.error(err);
      } finally {
        setLoading(false); // Detener el estado de carga
      }
    };

    fetchVentas();
  }, [userId]);

  // Renderizar mientras carga o si hay errores
  if (loading) return <p>Cargando compras...</p>;
  if (error) return <p className="error">{error}</p>;

  // Renderizar las compras
  return (
    <div className="MisComprasContainer">
      <h1 className="MisComprasHeader">Mis Compras</h1>
      {ventas.length === 0 ? (
        <p>No has realizado ninguna compra.</p>
      ) : (
        <div>
          {ventas.map((venta) => (
            <div key={venta.id} className="CompraCard">
              <h2 className="CompraCardHeader">Compra #{venta.id}</h2>
              <p>Fecha: {venta.fechaCompra}</p>
              <h3>Videojuegos:</h3>
              <ul className="CompraVideojuegos">
                {venta.videojuegoVentas.map((videojuego) => (
                  <li key={videojuego.id}>
                    <p>
                      <strong>Nombre:</strong> {videojuego.nombre}
                    </p>
                    <p>
                      <strong>Precio:</strong> ${videojuego.precio}
                    </p>
                    <p>
                      <strong>Cantidad:</strong> {videojuego.cantidad}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <button
        className="MisComprasButton"
        onClick={() => navigate("/user/home")} // Cambia "/user/home" por la ruta deseada
      >
        Volver
      </button>
    </div>
  );
};

export default Compras;
