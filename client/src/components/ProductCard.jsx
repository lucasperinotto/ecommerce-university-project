import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

function ProductCard({ producto }) {
  const { agregarItem } = useCarrito();
  const { showToast } = useToast();
  const { usuario } = useAuth();
  const { nombre, precio, categoria, estado, imagen, cantidad } = producto;
  const noDisponible = estado === 'inactivo' || cantidad === 0;

  const getObjectPosition = () => {
    if (categoria === 'anillos') return 'center 70%';
    return 'center';
  };

  const handleAgregar = (e) => {
    e.preventDefault();
    agregarItem(producto);
    showToast('Agregado al carrito con éxito', 'info');
  };

  return (
    <div className={`product-card ${noDisponible ? 'agotado' : ''}`}>
      <Link to={`/producto/${producto._id}`} className="product-card-link">
        <div className="product-card-img-wrap">
          {imagen ? (
            <img
              src={imagen}
              alt={nombre}
              className="product-card-img"
              style={{ objectPosition: getObjectPosition() }}
            />
          ) : (
            <div className="product-card-img-placeholder">
              <span>{categoria || 'Accesorio'}</span>
            </div>
          )}
          {noDisponible && <span className="product-card-badge">Sin stock</span>}
        </div>
        <div className="product-card-info">
          {categoria && <p className="product-card-categoria">{categoria}</p>}
          <h3 className="product-card-nombre">{nombre}</h3>
          <p className="product-card-precio">${Number(precio).toLocaleString('es-AR')}</p>
        </div>
      </Link>
      {usuario?.rol !== 'admin' && (
        <div className="product-card-actions">
          <button
            className="product-card-btn"
            onClick={handleAgregar}
            disabled={noDisponible}
          >
            {noDisponible ? 'Sin stock' : 'Agregar al carrito'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
