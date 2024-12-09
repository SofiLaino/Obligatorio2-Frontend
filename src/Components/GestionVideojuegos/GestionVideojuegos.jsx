import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../GestionVideojuegos/css/GestionVideojuegos.css";

const GestionVideojuegos = () => {
    const [videojuegos, setVideojuegos] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        nombre: "",
        descripcion: "",
        precio: 0,
        imagenURL: "",
        stock: 0,
        generoId: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [videojuegosResponse, generosResponse] = await Promise.all([
                    axios.get("http://localhost:5008/videojuegos"),
                    axios.get("http://localhost:5008/generos"),
                ]);
                setVideojuegos(videojuegosResponse.data);
                setGeneros(generosResponse.data);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "precio" || name === "stock" || name === "generoId" ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put("http://localhost:5008/videojuegos", formData);
            } else {
                await axios.post("http://localhost:5008/videojuegos/addVideojuego", formData);
            }
            resetForm();
            fetchVideojuegos();
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    const handleEdit = (videojuego) => {
        setFormData({ ...videojuego, generoId: videojuego.genero?.id || "" });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5008/videojuegos/${id}`);
            fetchVideojuegos();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            nombre: "",
            descripcion: "",
            precio: 0,
            imagenURL: "",
            stock: 0,
            generoId: "",
        });
        setIsEditing(false);
    };

    const fetchVideojuegos = async () => {
        try {
            const response = await axios.get("http://localhost:5008/videojuegos");

            setVideojuegos(response.data);
        } catch (error) {
            console.error("Error al cargar los videojuegos:", error);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
    };

    return (
        <main className="gestion-videojuegos">
            <button className="volver" onClick={() => navigate(-1)}>Volver</button>
            <h1>Gestión de Videojuegos</h1>

            <form onSubmit={handleSubmit} className="gestion-form">
                <div className="form-row">
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Género:
                        <select
                            name="generoId"
                            value={formData.generoId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Seleccionar género</option>
                            {generos.map((genero) => (
                                <option key={genero.id} value={genero.id}>
                                    {genero.nombre}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="form-row">
                    <label>
                        Descripción:
                        <textarea
                            name="descripcion"
                            placeholder="Descripción"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div className="form-row">
                    <label>
                        Precio (USD):
                        <input
                            type="number"
                            name="precio"
                            placeholder="Precio"
                            value={formData.precio}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Stock:
                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div className="form-row">
                    <label>
                        URL de Imagen:
                        <input
                            type="text"
                            name="imagenURL"
                            placeholder="URL de Imagen"
                            value={formData.imagenURL}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div className="form-buttons">
                    <button type="submit">{isEditing ? "Actualizar" : "Agregar"}</button>
                    {isEditing && <button type="button" onClick={resetForm}>Cancelar</button>}
                </div>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {videojuegos.map(({ id, nombre, descripcion, precio, stock, imagenURL, genero }) => (
                        <tr key={id}>
                            <td>{nombre}</td>
                            <td>{descripcion}</td>
                            <td>{formatCurrency(precio)}</td>
                            <td>{`Stock: ${stock}`}</td>
                            <td>
                                <button onClick={() => handleEdit({ id, nombre, descripcion, precio, stock, imagenURL, genero })}>
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default GestionVideojuegos;