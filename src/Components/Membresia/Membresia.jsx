import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Membresia/css/Membresia.css";

const Membresia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [savedCard, setSavedCard] = useState({}); // Estado para las tarjetas guardadas
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardType: "credito", // Por defecto, 'credito'
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    issuer: "Visa", // Por defecto, 'Visa'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      setLoading(true);
      axios
        .get(`http://localhost:5008/usuarios/${userId}`)
        .then((response) => {
          setUsuario(response.data);
          setSavedCard(response.data.tarjeta);
        })
        .catch(() => {
          setError("Error al cargar los datos del usuario");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const vincularMembresia = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setLoading(true);
      axios
        .put(`http://localhost:5008/usuarios/${userId}/membresia/1`)
        .then((response) => {
          setUsuario(response.data);
          alert("¡Ahora eres un miembro Premium!");
          navigate("/user/beneficios");
        })
        .catch(() => {
          setError("Error al vincular la membresía");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const guardarTarjeta = async () => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.post("http://localhost:5008/tarjetas/addTarjeta", {
        numero: paymentDetails.cardNumber,
        tipo: paymentDetails.cardType,
        nombreTarjeta: paymentDetails.cardHolder,
        fechaVencimiento: paymentDetails.expiryDate,
        cvv: paymentDetails.cvv,
        emisor: paymentDetails.issuer,
        usuario: { id: parseInt(userId, 10) },
      });
      alert("Tarjeta guardada con éxito.");
    } catch (err) {
      alert("Error al guardar la tarjeta.");
      console.error(err);
    }
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    const { cardNumber, cardHolder, expiryDate, cvv } = paymentDetails;

    // Validaciones
    if (!/^\d{13,19}$/.test(cardNumber)) {
      alert("El número de tarjeta debe tener entre 13 y 19 dígitos.");
      return;
    }

    if (!cardHolder.trim()) {
      alert("El nombre del titular de la tarjeta es obligatorio.");
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

    setLoading(true);
    try {
      setTimeout(async () => {
        alert("Pago realizado con éxito. Ahora eres Premium.");
        await guardarTarjeta();
        vincularMembresia();
        setShowPaymentForm(false);
      }, 2000);
    } catch (err) {
      alert("Error al procesar el pago.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSelectCard = (e) => {
    const selectedCard = savedCard;
    if (selectedCard) {
      setPaymentDetails({
        cardNumber: selectedCard.numero,
        cardType: selectedCard.tipo,
        cardHolder: selectedCard.nombreTarjeta,
        expiryDate: selectedCard.fechaVencimiento,
        cvv: "",
      });
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="explorar-premium">
      <h1>Explorar Premium</h1>
      {usuario && (
        <div>
          <h2>Bienvenido, {usuario.nombre}</h2>
          {usuario.membresia ? (
            <>
              <p>Ya eres un usuario Premium.</p>
              <button onClick={() => alert("Cancelar membresía no implementado.")}>
                Cancelar Membresía
              </button>
            </>
          ) : (
            <>
              <p>
                Obtén acceso exclusivo a contenido Premium.
                ¿Estás listo para desbloquear todos los beneficios por USD 10 al mes?
              </p>
              <div className="button-container">
                <button className="volver" onClick={() => navigate(-1)}>
                  Volver
                </button>
                {!showPaymentForm && (
                  <button onClick={() => setShowPaymentForm(true)}>Hazte Premium</button>
                )}
              </div>
              {showPaymentForm && (
                <form onSubmit={handlePayment} className="payment-form">
                  <h3>Detalles de Pago</h3>
                  <select onChange={handleSelectCard}>
                    <option value="">Seleccionar tarjeta guardada</option>
                    <option key={savedCard.id} value={savedCard.id}>
                      {savedCard.tipo} - {savedCard.numero.slice(-4)}
                    </option>
                  </select>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Número de tarjeta"
                    value={paymentDetails.cardNumber}
                    onChange={handlePaymentChange}
                    required
                  />
                  <select
                    name="cardType"
                    value={paymentDetails.cardType}
                    onChange={handlePaymentChange}
                    required
                  >
                    <option value="credito">Tarjeta de Crédito</option>
                    <option value="debito">Tarjeta de Débito</option>
                  </select>
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
                  <input
                    type="text"
                    name="cardHolder"
                    placeholder="Titular de la tarjeta"
                    value={paymentDetails.cardHolder}
                    onChange={handlePaymentChange}
                    required
                  />
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="Fecha de expiración (MM/AA)"
                    value={paymentDetails.expiryDate}
                    onChange={handlePaymentChange}
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={paymentDetails.cvv}
                    onChange={handlePaymentChange}
                    required
                  />
                  <button type="submit">Confirmar Pago</button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Membresia;