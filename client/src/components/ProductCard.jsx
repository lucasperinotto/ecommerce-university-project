import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ producto }) {
  const { id, nombre, precio, categoria, estado, imagen } = producto;
  const noDisponible = estado === 'no disponible';

  const getObjectPosition = () => {
    if (categoria === 'anillos') return 'center 70%';
    return 'center';
  };

  return (
    <Link to={`/producto/${producto._id}`} className={`product-card ${noDisponible ? 'agotado' : ''}`}>
      <div className="product-card-img-wrap">
        {imagen ? (
          <img src={imagen} alt={nombre} className="product-card-img" style={{ objectPosition: getObjectPosition() }} />
        ) : (
          <div className="product-card-img-placeholder">
            <span>{categoria || 'Accesorio'}</span>
          </div>
        )}
        {noDisponible && <span className="product-card-badge">Agotado</span>}
      </div>
      <div className="product-card-info">
        {categoria && <p className="product-card-categoria">{categoria}</p>}
        <h3 className="product-card-nombre">{nombre}</h3>
        <p className="product-card-precio">${Number(precio).toLocaleString('es-AR')}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
