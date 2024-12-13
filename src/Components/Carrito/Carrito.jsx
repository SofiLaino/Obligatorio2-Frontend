import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Carrito/css/Carrito.css";

const Carrito = () => {
  const [cart, setCart] = useState([]); // Estado para almacenar el carrito
  const [showPaymentForm, setShowPaymentForm] = useState(false); // Mostrar formulario de pago
  const [savedCards, setSavedCards] = useState([]); // Tarjetas guardadas del usuario
  const [selectedCardId, setSelectedCardId] = useState(""); // Tarjeta seleccionada
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardType: "credito", // Por defecto, 'credito'
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    issuer: "Visa", // Por defecto, 'Visa'
  });
  const [isPremium, setIsPremium] = useState(false); // Estado para determinar si es usuario premium

  const navigate = useNavigate();

  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(carrito);

    const userId = localStorage.getItem("userId");
    if (userId) {
      // Verificar si el usuario tiene membresía premium
      axios
        .get(`http://localhost:5008/usuarios/${userId}`)
        .then((response) => {
          setIsPremium(!!response.data.membresia);
          setSavedCards(response.data.tarjetas || []); // Asignar tarjetas guardadas
        })
        .catch((err) => {
          console.error("Error al cargar datos del usuario: ", err);
        });
    }
  }, []);

  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    let total = cart.reduce((sum, item) => sum + parseFloat(item.precio) * item.cantidad, 0);
    if (isPremium) {
      total *= 0.8; // Aplicar 20% de descuento si es usuario premium
    }
    return total.toFixed(2);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleCardSelection = (e) => {
    const cardId = e.target.value;
    setSelectedCardId(cardId);

    if (cardId) {
      const selectedCard = savedCards.find((card) => card.id === parseInt(cardId, 10));
      if (selectedCard) {
        setPaymentDetails({
          cardNumber: selectedCard.numero,
          cardType: selectedCard.tipo,
          cardHolder: selectedCard.nombreTarjeta,
          expiryDate: selectedCard.fechaVencimiento,
          cvv: "", 
          issuer: selectedCard.emisor,
        });
      }
    } else {
      setPaymentDetails({
        cardNumber: "",
        cardType: "credito",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
        issuer: "Visa",
      });
    }
  };

  const handleCheckout = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Debes iniciar sesión para realizar la compra.");
        return;
      }

      const videojuegosVendidos = cart.map((item) => ({
        id: item.id,
        cantidad: item.cantidad,
      }));

      const venta = {
        usuario: { id: parseInt(userId, 10) },
        videojuegoVentas: videojuegosVendidos,
      };

      await axios.post("http://localhost:5008/ventas/addVenta", venta);

      alert("Compra realizada con éxito.");
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/user/home");
    } catch (error) {
      alert("Hubo un problema al procesar la compra.");
      console.error(error);
    }
  };

  const handlePayment = (event) => {
    event.preventDefault();

    const { cardNumber, cardHolder, expiryDate, cvv } = paymentDetails;

    if (!/^\d{13,19}$/.test(cardNumber)) {
      alert("El número de tarjeta debe tener entre 13 y 19 dígitos.");
      return;
    }

    const [month, year] = expiryDate.split("/").map(Number);
    const now = new Date();
    const expiry = new Date(`20${year}`, month - 1);
    if (expiry <= now || !month || !year || month < 1 || month > 12) {
      alert("La fecha de expiración debe ser válida y posterior a la fecha actual.");
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      alert("El CVV debe tener exactamente 3 dígitos.");
      return;
    }

    alert("Pago realizado con éxito.");
    setShowPaymentForm(false);
    handleCheckout();
  };

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
      <h2>Total: ${calculateTotal()} {isPremium && <span>(20% OFF aplicado)</span>}</h2>
      {!showPaymentForm ? (
        <button onClick={() => setShowPaymentForm(true)} className="checkout-button">
          Finalizar Compra
        </button>
      ) : (
        <form onSubmit={handlePayment} className="payment-form">
          <h3>Detalles de Pago</h3>
          <div className="form-row">
            <select value={selectedCardId} onChange={handleCardSelection} className="select-card">
              <option value="">Seleccionar tarjeta guardada</option>
              {savedCards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.tipo} - {card.numero.slice(-4)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <input
              type="text"
              name="cardNumber"
              placeholder="Número de tarjeta"
              value={paymentDetails.cardNumber}
              onChange={handlePaymentChange}
              required
            />
          </div>
          <div className="form-row">
            <select
              name="cardType"
              value={paymentDetails.cardType}
              onChange={handlePaymentChange}
              required
            >
              <option value="credito">Tarjeta de Crédito</option>
              <option value="debito">Tarjeta de Débito</option>
            </select>
          </div>
          <div className="form-row">
            <select
              name="issuer"
              value={paymentDetails.issuer}
              onChange={handlePaymentChange}
              required
            >
              <option value="Visa">Visa</option>
              <option value="MasterCard">MasterCard</option>
              <option value="OCA">OCA</option>
              <option value="Prex">Prex</option>
            </select>
          </div>
          <div className="form-row">
            <input
              type="text"
              name="cardHolder"
              placeholder="Titular de la tarjeta"
              value={paymentDetails.cardHolder}
              onChange={handlePaymentChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="expiryDate"
              placeholder="Fecha de expiración (MM/AA)"
              value={paymentDetails.expiryDate}
              onChange={handlePaymentChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={paymentDetails.cvv}
              onChange={handlePaymentChange}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className="checkout-button">
              Confirmar Pago
            </button>
            <button onClick={() => navigate("/user/home")} className="back-button">
              Volver
            </button>
          </div>

        </form>
      )}
    </div>
  );
};

export default Carrito;