import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../GestionUsuarios/css/GestionUsuarios.css";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        let url = "http://localhost:5008/usuarios";  // URL para obtener todos los usuarios
        if (filtro === "regular") {
          url += "/regular";  // URL para obtener usuarios regulares
        } else if (filtro === "premium") {
          url += "/premium";  // URL para obtener usuarios premium
        }

        const response = await axios.get(url);
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };

    fetchUsuarios();
  }, [filtro]);  // Cuando el filtro cambie, volverá a cargar los usuarios

  const usuariosFiltrados = usuarios.filter((usuario) => 
    filtro === "todos" || usuario.tipo === filtro  // Filtrar por tipo
  );

  return (
    <div className="GestionUsuariosContainer">
      <button className="GestionUsuariosButton" onClick={() => navigate(-1)}>Volver</button>
      <h1 className="GestionUsuariosHeader">Gestión de Usuarios</h1>
      
      {/* Filtro para seleccionar el tipo de usuario */}
      <label className="GestionUsuariosLabel">
        Filtrar por tipo:
        <select
          className="GestionUsuariosSelect"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}  // Cambia el filtro
        >
          {["todos", "regular", "premium"].map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}  {/* Mostrar tipo con mayúscula */}
            </option>
          ))}
        </select>
      </label>

      {/* Tabla para mostrar los usuarios */}
      <table className="GestionUsuariosTable">
        <thead>
          <tr>
            {["Nombre", "Email", "Tipo"].map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map(({ id, nombre, email, tipo }) => (
            <tr key={id}>
              {[nombre, email, tipo].map((data, idx) => (
                <td key={idx}>{data}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionUsuarios;
