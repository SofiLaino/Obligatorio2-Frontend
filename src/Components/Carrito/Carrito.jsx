import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Carrito/css/Carrito.css";

const Carrito = () => {
  const [cart, setCart] = useState([]); // Estado para almacenar el carrito
  const navigate = useNavigate();

  // Cargar el carrito desde el localStorage al montar el componente
  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(carrito);
  }, []);

  // Manejar la eliminación de un artículo del carrito
  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + parseFloat(item.precio) * item.cantidad, 0)
      .toFixed(2);
  };

  // Manejar la finalización de la compra
  const handleCheckout = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Obtener el ID del usuario
      if (!userId) {
        alert("Debes iniciar sesión para realizar la compra.");
        return;
      }
  
      // Formatear los videojuegos vendidos para enviarlos a la API
      const videojuegosVendidos = cart.map((item) => ({
        id: item.id, // Ajustado para coincidir con el backend
        cantidad: item.cantidad,
      }));
  
      // Crear el objeto de la venta
      const venta = {
        usuario: { id: parseInt(userId, 10) },
        videojuegoVentas: videojuegosVendidos,
      };
  
      console.log("Venta enviada:", JSON.stringify(venta, null, 2));
  
      // Enviar la compra a la API
      await axios.post("http://localhost:5008/ventas/addVenta", venta);
  
      // Actualizar el stock para cada videojuego vendido
      for (const videojuego of videojuegosVendidos) {
        await axios.patch(`http://localhost:5008/videojuegos/${videojuego.id}/stock`, {
          cantidad: videojuego.cantidad,
        });
      }
  
      alert("Compra realizada con éxito.");
      localStorage.removeItem("cart"); // Limpiar el carrito en localStorage
      setCart([]); // Limpiar el estado del carrito
      navigate("/user/home"); // Redirigir al usuario al home
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message; // Asegúrate de que el backend envíe un mensaje claro
        alert(errorMessage || "Hubo un problema con la compra. Verifica el stock disponible.");
      } else {
        console.error("Error al realizar la compra:", error);
        alert("Hubo un problema al procesar la compra.");
      }
    }
  };
  
  

  // Si el carrito está vacío, mostrar un mensaje
  if (cart.length === 0)
    return (
      <div className="carrito">
        <h1>Tu Carrito</h1>
        <p>Tu carrito está vacío.</p>
        <button onClick={() => navigate("/user/home")} className="back-button">
          Volver
        </button>
      </div>
    );

  // Mostrar el contenido del carrito
  return (
    <div className="carrito">
      <h1>Tu Carrito</h1>
      <ul>
        {cart.map((videojuego) => (
          <li key={videojuego.id} className="cart-item">
            <div className="cart-item-details">
              <p>
                <strong>Nombre:</strong> {videojuego.nombre}
              </p>
              <p>
                <strong>Precio:</strong> ${parseFloat(videojuego.precio).toFixed(2)}
              </p>
              <p>
                <strong>Cantidad:</strong> {videojuego.cantidad}
              </p>
            </div>
            <button onClick={() => handleRemove(videojuego.id)} className="remove-button">
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <h2>Total: ${calculateTotal()}</h2>
      <button onClick={handleCheckout} className="checkout-button">
        Finalizar Compra
      </button>
      <button onClick={() => navigate("/user/home")} className="back-button">
        Volver
      </button>
    </div>
  );
};

export default Carrito;
