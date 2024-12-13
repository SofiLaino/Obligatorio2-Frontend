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
        const response = await axios.get(`http://localhost:5008/ventas/usuarios/${userId}/ventas`);
        console.log("Ventas obtenidas:", response.data);
        setVentas(response.data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar las compras:", err);
        setError("Error al cargar las compras.");
      } finally {
        setLoading(false);
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
      <button
        className="MisComprasButton"
        onClick={() => navigate("/user/home")}
      >
        Volver
      </button>
      <h1 className="MisComprasHeader">Mis Compras</h1>
      {ventas.length === 0 ? (
        <p>No has realizado ninguna compra.</p>
      ) : (
        <div className="CompraGrid">
          {ventas.map((venta) =>
            venta.videojuegoVentas.map((videojuego) => (
              <div key={videojuego.id} className="VideojuegoCard">
                <div className="VideojuegoImageContainer">
                  <img
                    src={videojuego.imagenURL?.trim() || "https://via.placeholder.com/150"}
                    alt={videojuego.nombre || "Imagen no disponible"}
                    className="VideojuegoImage"
                  />

                </div>
                <div className="VideojuegoInfo">
                  <p><strong>Nombre:</strong> {videojuego.nombre}</p>
                  <p><strong>Cantidad:</strong> {videojuego.cantidad}</p>
                  <p><strong>Precio:</strong> ${videojuego.precio.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

export default Compras;