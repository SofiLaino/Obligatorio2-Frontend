import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../Login/css/Login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSwitchMode = () => {
    navigate('/registro');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const url = 'http://localhost:5008/usuarios/login';

    try {
      const response = await axios.post(url, { email, password });
      if (response.status === 200) {
        // Guardar id y nombre del usuario en localStorage
        localStorage.setItem('userId', response.data.id);
        localStorage.setItem('userName', response.data.nombre);

        alert('Inicio de sesión exitoso');
        navigate("/user/home");
      } else {
        // Manejo de error si las credenciales son incorrectas
        setError("Credenciales incorrectas");
      }
    } catch (err) {
      // Manejo de errores más detallado
      const errorMsg = err.response?.data?.message || 'Error en la autenticación';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <p className="toggle-button" onClick={() => navigate('/login-admin')}>
        ¿Eres administrador? Ingresa aquí
      </p>
      <h2>Iniciar Sesión</h2>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Contraseña:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
      <p className="toggle-button" onClick={handleSwitchMode}>
        ¿No tienes una cuenta? Regístrate
      </p>
    </form>
  );
};

export default Login;