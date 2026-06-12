import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { useToast } from '../context/ToastContext';
import './Navbar.css';

function Navbar() {
  const { usuario, logout } = useAuth();
  const { cantidadTotal } = useCarrito();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [hamburguesa, setHamburguesa] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  const cerrarHamburguesa = () => setHamburguesa(false);

  const handleLogout = () => {
    const nombre = usuario?.nombre;
    logout();
    setDropdownAbierto(false);
    showToast(`¡Hasta pronto, ${nombre}!`);
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        {/* Izquierda — hamburguesa */}
        <div className="navbar-izquierda">
          <button
            className="navbar-hamburguesa"
            onClick={() => setHamburguesa((v) => !v)}
            aria-label="Menú"
          >
            <span className={`hamburguesa-linea ${hamburguesa ? 'abierto' : ''}`} />
            <span className={`hamburguesa-linea ${hamburguesa ? 'abierto' : ''}`} />
            <span className={`hamburguesa-linea ${hamburguesa ? 'abierto' : ''}`} />
          </button>
        </div>

        {/* Centro — logo */}
        <Link to="/" className="navbar-logo">
          <img src="/images/logo.PNG" alt="Sabina Accesorios" className="navbar-logo-img" />
        </Link>

        {/* Derecha — carrito + auth */}
        <div className="navbar-derecha">
          <Link to="/carrito" className="navbar-carrito" title="Carrito">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cantidadTotal > 0 && (
              <span className="navbar-carrito-badge">{cantidadTotal}</span>
            )}
          </Link>

          {usuario ? (
            <div className="navbar-usuario">
              <button
                className="navbar-usuario-btn"
                onClick={() => setDropdownAbierto((v) => !v)}
              >
                {usuario.nombre}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {dropdownAbierto && (
                <div className="navbar-dropdown">
                  <Link to="/perfil" onClick={() => setDropdownAbierto(false)}>Mi perfil</Link>
                  <Link to="/mis-ordenes" onClick={() => setDropdownAbierto(false)}>Mis órdenes</Link>
                  {usuario.rol === 'admin' && (
                    <>
                      <div className="navbar-dropdown-divider" />
                      <Link to="/admin/productos" onClick={() => setDropdownAbierto(false)}>Productos</Link>
                      <Link to="/admin/usuarios" onClick={() => setDropdownAbierto(false)}>Usuarios</Link>
                      <Link to="/admin/ordenes" onClick={() => setDropdownAbierto(false)}>Órdenes</Link>
                    </>
                  )}
                  <div className="navbar-dropdown-divider" />
                  <button onClick={handleLogout} className="navbar-dropdown-salir">
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-auth-link">Ingresar</Link>
              <Link to="/registro" className="navbar-auth-registro">Registrarse</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Menú hamburguesa desplegable */}
      {hamburguesa && (
        <div className="navbar-overlay" onClick={cerrarHamburguesa}>
          <div className="navbar-menu" onClick={(e) => e.stopPropagation()}>
            <Link to="/" className="navbar-menu-link" onClick={cerrarHamburguesa}>
              Inicio
            </Link>
            <div className="navbar-menu-seccion">
              <Link to="/catalogo" className="navbar-menu-link" onClick={cerrarHamburguesa}>
                Catálogo
              </Link>
              <div className="navbar-menu-categorias">
                {['anillos', 'aros', 'collares', 'carteras'].map((cat) => (
                  <Link
                    key={cat}
                    to={`/catalogo?categoria=${cat}`}
                    className="navbar-menu-categoria"
                    onClick={cerrarHamburguesa}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
