import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../VideojuegoDetails/css/VideojuegoDetails.css";

const VideojuegoDetails = () => {
  const { videojuegoId } = useParams();
  const [videojuego, setVideojuego] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [puedeDejarResena, setPuedeDejarResena] = useState(false);
  const [resena, setResena] = useState("");
  const [calificacion, setCalificacion] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Cargar los detalles del videojuego
  useEffect(() => {
    const fetchVideojuego = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5008/videojuegos/${videojuegoId}`
        );
        setVideojuego(response.data);
      } catch (err) {
        setError("Error al cargar los detalles del videojuego");
      } finally {
        setLoading(false);
      }
    };

    fetchVideojuego();
  }, [videojuegoId]);

  // Verificar si el usuario puede dejar una reseña
  useEffect(() => {
    if (userId) {
      const verificarSiPuedeDejarResena = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5008/resenas/puedeDejarResena?usuarioId=${userId}&videojuegoId=${videojuegoId}`
          );
          setPuedeDejarResena(response.data === "El usuario puede dejar una reseña.");
        } catch (err) {
          console.log("Error al verificar si el usuario puede dejar una reseña", err);
        }
      };

      verificarSiPuedeDejarResena();
    }
  }, [userId, videojuegoId]);

  const handleResenaSubmit = async (e) => {
    e.preventDefault();

    if (!resena || !calificacion) {
      alert("Por favor completa todos los campos antes de enviar.");
      return;
    }

    const resenaData = {
      resena,
      calificacion: parseInt(calificacion, 10),
      videojuegoId: parseInt(videojuegoId, 10),
      usuarioId: parseInt(userId, 10),
    };

    try {
      await axios.post("http://localhost:5008/resenas/addResena", resenaData);
      alert("Reseña enviada exitosamente.");
      setResena("");
      setCalificacion("");
      // Recargar los detalles del videojuego para incluir la nueva reseña
      const response = await axios.get(
        `http://localhost:5008/videojuegos/${videojuegoId}`
      );
      setVideojuego(response.data);
    } catch (err) {
      console.error("Error al enviar la reseña:", err);
      alert("Hubo un error al enviar la reseña.");
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const calcularPromedioCalificacion = () => {
    if (videojuego.resenas && videojuego.resenas.length > 0) {
      const totalCalificacion = videojuego.resenas.reduce(
        (total, resena) => total + resena.calificacion,
        0
      );
      return (totalCalificacion / videojuego.resenas.length).toFixed(2);
    }
    return "N/A";
  };

  if (loading) return <p className="loading">Cargando detalles...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="videojuego-profile">
      <h2>Detalles del Videojuego</h2>
      <div className="videojuego-image">
        <img
          src={videojuego.imagenURL || "https://via.placeholder.com/300"}
          alt={videojuego.nombre}
        />
      </div>
      <div className="videojuego-info">
        <p>
          <strong>Nombre:</strong> {videojuego.nombre}
        </p>
        <p>
          <strong>Descripción:</strong> {videojuego.descripcion}
        </p>
        <p>
          <strong>Precio:</strong> {formatCurrency(videojuego.precio)}
        </p>
        <p>
          <strong>Stock:</strong> {videojuego.stock}
        </p>
        <p>
          <strong>Género:</strong>{" "}
          {videojuego.genero ? videojuego.genero.nombre : "N/A"}
        </p>
        <p>
          <strong>Promedio de Calificación:</strong> {calcularPromedioCalificacion()}
        </p>
        <p><strong>Reseñas:</strong></p>
        {videojuego.resenas && videojuego.resenas.length > 0 ? (
          <ul>
            {videojuego.resenas.map((resena, index) => (
              <li key={index}>
                <p>{resena.resena}</p>
                <p><strong>Fecha:</strong> {resena.fecha}</p>
                <p><strong>Usuario:</strong> {resena.usuario.nombre} {resena.usuario.apellido}</p>
                <p><strong>Email del Usuario:</strong> {resena.usuario.email}</p>
                <p><strong>Calificación:</strong> {resena.calificacion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay reseñas disponibles.</p>
        )}

        {puedeDejarResena ? (
          <div className="add-resena-form">
            <h3>Deja tu Reseña</h3>
            <form onSubmit={handleResenaSubmit}>
              <textarea
                placeholder="Escribe tu reseña..."
                rows="4"
                value={resena}
                onChange={(e) => setResena(e.target.value)}
              />
              <input
                type="number"
                min="1"
                max="5"
                placeholder="Calificación (1-5)"
                value={calificacion}
                onChange={(e) => setCalificacion(e.target.value)}
              />
              <button type="submit">Enviar Reseña</button>
            </form>
          </div>
        ) : (
          <p>El usuario no puede dejar una reseña, ya que no ha comprado este videojuego.</p>
        )}
      </div>
      <button className="back-button" onClick={() => navigate("/user/home")}>
        Regresar a la Lista de Videojuegos
      </button>
    </div>
  );
};

export default VideojuegoDetails;

