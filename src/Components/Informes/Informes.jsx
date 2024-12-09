import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Informes = () => {
  const [mejores, setMejores] = useState([]);
  const [peores, setPeores] = useState([]);
  const [todos, setTodos] = useState([]); // Estado para almacenar todos los videojuegos
  const [stockFiltro, setStockFiltro] = useState(""); // Almacena el número de stock ingresado por el usuario
  const [videojuegosFiltrados, setVideojuegosFiltrados] = useState([]); // Videojuegos filtrados por stock
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideojuegos = async () => {
      try {
        // Obtener mejores videojuegos
        const mejoresResponse = await axios.get("http://localhost:5008/videojuegos/mejores");
        setMejores(mejoresResponse.data);

        // Obtener peores videojuegos
        const peoresResponse = await axios.get("http://localhost:5008/videojuegos/peores");
        setPeores(peoresResponse.data);

        // Obtener todos los videojuegos
        const todosResponse = await axios.get("http://localhost:5008/videojuegos");
        setTodos(todosResponse.data);
      } catch (err) {
        setError("Error al obtener los videojuegos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideojuegos();
  }, []);

  const calcularPromedio = (resenas) => {
    if (resenas.length === 0) return "Sin calificaciones";
    const suma = resenas.reduce((acc, resena) => acc + resena.calificacion, 0);
    return (suma / resenas.length).toFixed(1);
  };

  const filtrarPorStock = () => {
    if (!stockFiltro) {
      setVideojuegosFiltrados([]);
      return;
    }
    const filtrados = todos.filter((videojuego) => videojuego.stock <= parseInt(stockFiltro, 10));


    setVideojuegosFiltrados(filtrados);
  };

  return (
    <div>
      <button className="volver" onClick={() => navigate(-1)}>Volver</button>
      <h1>Informes de Videojuegos</h1>

      {loading && <p>Cargando...</p>}

      {error && <p>{error}</p>}

      {/* Mejores videojuegos */}
      <div>
        <h2>Mejores Videojuegos</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Promedio de Calificación</th>
            </tr>
          </thead>
          <tbody>
            {mejores.map((videojuego) => (
              <tr key={videojuego.id}>
                <td>{videojuego.nombre}</td>
                <td>{calcularPromedio(videojuego.resenas)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Peores videojuegos */}
      <div>
        <h2>Peores Videojuegos</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Promedio de Calificación</th>
            </tr>
          </thead>
          <tbody>
            {peores.map((videojuego) => (
              <tr key={videojuego.id}>
                <td>{videojuego.nombre}</td>
                <td>{calcularPromedio(videojuego.resenas)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filtro por stock */}
      <div>
        <h2>Filtrar Videojuegos por Stock</h2>
        <label htmlFor="stockFiltro">Stock mínimo: </label>
        <input
          id="stockFiltro"
          type="number"
          value={stockFiltro}
          onChange={(e) => setStockFiltro(e.target.value)}
          placeholder="Ej. 5"
        />
        <button onClick={filtrarPorStock}>Filtrar</button>

        {/* Resultados filtrados */}
        {videojuegosFiltrados.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Promedio de Calificación</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {videojuegosFiltrados.map((videojuego) => (
                <tr key={videojuego.id}>
                  <td>{videojuego.nombre}</td>
                  <td>{calcularPromedio(videojuego.resenas)}</td>
                  <td>{videojuego.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {videojuegosFiltrados.length === 0 && stockFiltro && <p>No se encontraron videojuegos con el stock mínimo indicado.</p>}
      </div>
    </div>
  );
};

export default Informes;