import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registro from '../Registro/Registro';
import Login from '../Login/Login';
import LoginAdmin from '../LoginAdmin/LoginAdmin';
import AdminHome from "../AdminHome/AdminHome";
import GestionVideojuegos from "../GestionVideojuegos/GestionVideojuegos";
import GestionUsuarios from "../GestionUsuarios/GestionUsuarios";
import GestionVentas from "../GestionVentas/GestionVentas";
import Informes from "../Informes/Informes";
import UserHome from '../UserHome/UserHome';
import VideojuegoDetails from '../VideojuegoDetails/VideojuegoDetails'
import "../App/css/App.css";
import Membresia from '../Membresia/Membresia'
import BeneficiosPremium from "../BeneficiosPremium/BeneficiosPremium";
import Carrito from "../Carrito/Carrito";
import VentasPorFecha from '../GestionVentas/VentasPorFecha';
import VentasPorUsuario from '../GestionVentas/VentasPorUsuario';
import Compras from '../Compras/Compras';



const App = () => {
    return (
        <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login-admin" element={<LoginAdmin />} />
                    <Route path="/admin/home" element={<AdminHome />} />
                    <Route path="/admin/videojuegos" element={<GestionVideojuegos />} />
                    <Route path="/admin/usuarios" element={<GestionUsuarios />} />
                    <Route path="/admin/ventas" element={<GestionVentas />} />
                    <Route path="/admin/ventasPorFecha" element={<VentasPorFecha />} />
                    <Route path="/admin/ventasPorUsuario" element={<VentasPorUsuario />} />
                    <Route path="/admin/informes" element={<Informes />} />
                    <Route path="/user/home" element={<UserHome />} />
                    <Route path="/videojuego/:videojuegoId" element={<VideojuegoDetails />} />
                    <Route path="/user/membresia" element={<Membresia />} />
                    <Route path="/user/beneficios" element={<BeneficiosPremium />} />
                    <Route path="/user/carrito" element={<Carrito />} />
                    <Route path="/user/compras" element={<Compras />} />

                </Routes>
        </Router>
    );
};

export default App;
