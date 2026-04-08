import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src="/logo.PNG" alt="Sabina Accesorios" className="navbar-logo-img" />
      </Link>
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/catalogo">Catálogo</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
