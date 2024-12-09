import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserHome/css/UserHome.css";

const UserHome = () => {
  const [videojuegos, setVideojuegos] = useState([]); // Estado para los videojuegos
  const [usuario, setUsuario] = useState(null); // Estado para el usuario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // Obtener el ID del usuario

  // Fetch usuario
  const fetchUsuario = async () => {
    if (userId) {
      try {
        const response = await axios.get(`http://localhost:5008/usuarios/${userId}`);
        setUsuario(response.data);
        setError(null); // Limpiar errores previos si la llamada es exitosa
      } catch (err) {
        setError("Error al cargar los datos del usuario.");
        console.error(err);
      }
    }
  };

  // Fetch videojuegos
  const fetchVideojuegos = async () => {
    try {
      const response = await axios.get("http://localhost:5008/videojuegos");
      setVideojuegos(response.data);
      setError(null); // Limpiar errores previos si la llamada es exitosa
    } catch (err) {
      setError("Error al cargar los videojuegos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Llamadas iniciales para cargar datos
  useEffect(() => {
    fetchUsuario();
    fetchVideojuegos();
  }, []);

  // Refrescar datos del usuario cada 5 segundos
  useEffect(() => {
    const interval = setInterval(fetchUsuario, 5000);
    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, []);

  // Cerrar sesión
  const handleLogout = () => {
    alert("Has cerrado sesión.");
    localStorage.clear(); // Eliminar todos los datos del localStorage
    setUsuario(null); // Limpiar el estado del usuario
    navigate("/login");
  };

  // Agregar al carrito
  const handleAddToCart = (videojuego) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const index = cart.findIndex((item) => item.id === videojuego.id);

      if (index !== -1) {
        // Incrementar cantidad si ya existe en el carrito
        cart[index].cantidad += 1;
      } else {
        // Agregar nuevo artículo al carrito
        cart.push({ ...videojuego, cantidad: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${videojuego.nombre} agregado al carrito.`);
    } catch (err) {
      alert("Error al agregar el videojuego al carrito.");
      console.error(err);
    }
  };

  // Formatear precio
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  };

  // Renderizar mientras carga o si hay errores
  if (loading) return <p className="loading">Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="homepage">
      {/* Barra de navegación */}
      <div className="navbar">
        <div className="navbar-info">
          {usuario && (
            <>
              <p>
                Hola, <strong>{usuario.nombre}</strong>!
              </p>
              <p>
                Tipo de membresía:{" "}
                <strong>{usuario.membresia ? "Premium" : "Regular"}</strong>
              </p>
            </>
          )}
        </div>
        <div className="navbar-links">
          {/* Botones según el estado del usuario */}
          {!usuario?.membresia ? (
            <button onClick={() => navigate("/user/membresia")}>Explorar Premium</button>
          ) : (
            <button
              onClick={async () => {
                try {
                  await axios.put(`http://localhost:5008/usuarios/${userId}/desvincularMembresia`);
                  alert("Tu membresía ha sido desvinculada.");
                  fetchUsuario(); // Actualizar usuario después de desvincular
                } catch (err) {
                  setError("Error al desvincular la membresía.");
                  console.error(err);
                }
              }}
            >
              Desvincular Membresía
            </button>
          )}
          <button onClick={() => navigate("/user/compras")}>Mis Compras</button>
          <button onClick={() => navigate("/user/carrito")}>Ver Carrito</button>
          <button onClick={handleLogout} className="logout-button">
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Título */}
      <h1>Videojuegos Disponibles</h1>

      {/* Lista de videojuegos */}
      <div className="videojuego-cards">
        {videojuegos.map((videojuego) => (
          <div className="card" key={videojuego.id}>
            <div className="card-image">
              <img
                src={videojuego.imagenURL || "https://via.placeholder.com/200"}
                alt={videojuego.nombre}
              />
            </div>
            <div className="card-content">
              <h2>{videojuego.nombre}</h2>
              <p>{videojuego.descripcion}</p>
              <p>
                <strong>Precio:</strong> {formatCurrency(videojuego.precio)}
              </p>
              <p>
                <strong>Género:</strong>{" "}
                {videojuego.genero ? videojuego.genero.nombre : "N/A"}
              </p>
              <button onClick={() => navigate(`/videojuego/${videojuego.id}`)}>
                Ver Detalles
              </button>
              <button onClick={() => handleAddToCart(videojuego)}>
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHome;