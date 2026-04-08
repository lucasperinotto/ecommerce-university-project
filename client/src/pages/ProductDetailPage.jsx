import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../services/productosService';
import { getImagenCategoria } from '../utils/categoriaImagen';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProductoById(id)
      .then((res) => setProducto(res.data))
      .catch(() => setError('Producto no encontrado.'))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <p className="detalle-estado">Cargando...</p>;
  if (error) return <p className="detalle-estado detalle-error">{error}</p>;

  const noDisponible = producto.estado === 'no disponible';
  const imagen = getImagenCategoria(producto.categoria);

  return (
    <main className="detalle">
      <button className="detalle-volver" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="detalle-contenido">
        <div className="detalle-imagen-wrap">
          {imagen ? (
            <img src={imagen} alt={producto.nombre} className="detalle-imagen" />
          ) : (
            <div className="detalle-imagen-placeholder">
              <span>{producto.categoria || 'Accesorio'}</span>
            </div>
          )}
        </div>

        <div className="detalle-info">
          {producto.categoria && (
            <p className="detalle-categoria">{producto.categoria}</p>
          )}
          <h1 className="detalle-nombre">{producto.nombre}</h1>
          <p className="detalle-precio">${Number(producto.precio).toLocaleString('es-AR')}</p>

          {producto.descripcion && (
            <p className="detalle-descripcion">{producto.descripcion}</p>
          )}

          {producto.cantidad !== undefined && (
            <p className="detalle-stock">
              {noDisponible
                ? 'Sin stock'
                : `Stock disponible: ${producto.cantidad} unidades`}
            </p>
          )}

          <button className="detalle-btn" disabled={noDisponible}>
            {noDisponible ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailPage;
