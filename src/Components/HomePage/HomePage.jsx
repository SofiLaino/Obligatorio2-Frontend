import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../HomePage/css/HomePage.css";

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5001/users');
                setUsers(response.data);
            } catch (err) {
                setError("Error al cargar los usuarios");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="homepage">
            <h1>Lista de Usuarios</h1>
            <div className="user-cards">
                {users.map((user) => (
                    <div className="card" key={user.id}>
                        <div className="card-content">
                            <h2>ID: {user.id}</h2>
                            <p>Email: {user.email}</p>
                            <p>País: {user.country ? user.country.name : 'N/A'}</p>
                            <button onClick={() => navigate(`/user/${user.id}`)}>
                                Ver Perfil
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;