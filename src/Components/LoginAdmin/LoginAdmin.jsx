import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../Login/css/Login.css";

const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const url = 'http://localhost:5008/usuariosAdmin/login';

        try {
            const response = await axios.post(url, { email, password });
            console.log(response.data);
            if (response.status === 200) {
                alert('Inicio de sesión como administrador exitoso');
                navigate('/admin/home'); 
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
        <div className="auth-form">
            <div className="toggle-button" onClick={() => navigate('/login')}>
                {'¿Eres usuario? Ingresa aquí'}
            </div>
            <h2>Iniciar Sesión (Administrador)</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </button>
            </form>
        </div>
    );
};

export default LoginAdmin;
