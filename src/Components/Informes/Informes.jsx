import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Informes = () => {
  const [mejores, setMejores] = useState([]);
  const [peores, setPeores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  // Obtener los mejores videojuegos 
  useEffect(() => {
    const fetchMejoresVideojuegos = async () => {
      try {
        const response = await axios.get("http://localhost:5008/videojuegos/mejores");
        setMejores(response.data);
      } catch (err) {
        setError("Error al obtener los mejores videojuegos");
      } finally {
        setLoading(false);
      }
    };

    // Obtener los peores videojuegos 
    const fetchPeoresVideojuegos = async () => {
      try {
        const response = await axios.get("http://localhost:5008/videojuegos/peores");
        setPeores(response.data);
      } catch (err) {
        setError("Error al obtener los peores videojuegos");
      } finally {
        setLoading(false);
      }
    };

    fetchMejoresVideojuegos();
    fetchPeoresVideojuegos();
  }, []);

  return (
    <div>
      <button className="volver" onClick={() => navigate(-1)}>Volver</button>
      <h1>Informes de Videojuegos</h1>

      {loading && <p>Cargando...</p>}

      {error && <p>{error}</p>}

      <div>
        
        <h2>Mejores Videojuegos</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Calificación</th>
            </tr>
          </thead>
          <tbody>
            {mejores.map((videojuego) => (
              <tr key={videojuego.id}>
                <td>{videojuego.nombre}</td>
                <td>{videojuego.calificacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Peores Videojuegos</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Calificación</th>
            </tr>
          </thead>
          <tbody>
            {peores.map((videojuego) => (
              <tr key={videojuego.id}>
                <td>{videojuego.nombre}</td>
                <td>{videojuego.calificacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Informes;
