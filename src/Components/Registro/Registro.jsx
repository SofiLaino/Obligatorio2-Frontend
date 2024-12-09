import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../Registro/css/Registro.css";

const Registro = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSwitchMode = () => {
        navigate('/login');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const url = 'http://localhost:5008/usuarios/addUsuario';

        try {
            const response = await axios.post(url, { nombre, apellido, email, password });
            console.log(response.data);
            if (response.status === 201) {
                alert('Registro exitoso');
                navigate('/Login');
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error en la autenticación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{'Registrarse'}</h2>
            <label>
                Nombre:
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </label>
            <label>
                Apellido:
                <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required
                />
            </label>
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
                {loading ? 'Cargando...' : 'Registrarse'}
            </button>
            <p className="toggle-button" onClick={handleSwitchMode}>
                {'¿Ya tienes una cuenta? Inicia sesión'}
            </p>
        </form>
    );
};

export default Registro;