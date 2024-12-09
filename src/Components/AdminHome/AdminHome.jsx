import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaGamepad, FaUsers, FaShoppingCart, FaChartBar } from "react-icons/fa";
import "./css/AdminHome.css";

function AdminHome() {
    const navigate = useNavigate();
    return (
        <div className="admin-container">
            <button onClick={() => navigate(-1)} className="admin-logout">
                Cerrar sesión
            </button>

            <h1 className="admin-header">Panel de Administración</h1>

            <div className="admin-buttons-grid">
                <Link to="/admin/videojuegos">
                    <button className="admin-button">
                        <FaGamepad className="button-icon" />
                        <span className="button-text">Gestión de Videojuegos</span>
                    </button>
                </Link>
                <Link to="/admin/usuarios">
                    <button className="admin-button">
                        <FaUsers className="button-icon" />
                        <span className="button-text">Gestión de Usuarios</span>
                    </button>
                </Link>
                <Link to="/admin/ventas">
                    <button className="admin-button">
                        <FaShoppingCart className="button-icon" />
                        <span className="button-text">Gestión de Ventas</span>
                    </button>
                </Link>
                <Link to="/admin/informes">
                    <button className="admin-button">
                        <FaChartBar className="button-icon" />
                        <span className="button-text">Informes</span>
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default AdminHome;
