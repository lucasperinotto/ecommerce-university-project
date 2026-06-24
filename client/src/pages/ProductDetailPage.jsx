import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { getProductoById } from '../services/productosService';
import Spinner from '../components/Spinner';
import useTitulo from '../hooks/useTitulo';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarItem, items } = useCarrito();
  const { showToast } = useToast();
  const { usuario } = useAuth();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [agregado, setAgregado] = useState(false);
  useTitulo(producto?.nombre || 'Producto');

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const { data } = await getProductoById(id);
        setProducto(data);
      } catch (err) {
        setError('Producto no encontrado.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    fetchProducto();
  }, [id]);

  if (cargando) return <Spinner />;
  if (error) return <p className="detalle-estado detalle-error">{error}</p>;

  const agotado = producto.estado === 'inactivo' || producto.cantidad === 0;
  const cantidadEnCarrito = items.find((i) => i._id === producto._id)?.cantidad ?? 0;
  const enStockMaximo = producto.cantidad != null && cantidadEnCarrito >= producto.cantidad;
  const noDisponible = agotado || enStockMaximo;
  const imagenes = producto.imagenes || (producto.imagen ? [producto.imagen] : []);

  const handleAgregar = () => {
    if (noDisponible) return;
    agregarItem(producto);
    showToast('Agregado al carrito con éxito', 'info');
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  return (
    <main className="detalle">
      <button className="detalle-volver" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="detalle-contenido">
        <div className="detalle-galeria">
          {imagenes.length > 1 && (
            <div className="detalle-thumbnails">
              {imagenes.map((img, i) => (
                <button
                  key={i}
                  className={`detalle-thumb${i === imagenActiva ? ' activo' : ''}`}
                  onClick={() => setImagenActiva(i)}
                >
                  <img src={img} alt={`${producto.nombre} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
          <div className="detalle-imagen-wrap">
            {imagenes.length > 0 ? (
              <img src={imagenes[imagenActiva]} alt={producto.nombre} className="detalle-imagen" />
            ) : (
              <div className="detalle-imagen-placeholder">
                <span>{producto.categoria || 'Accesorio'}</span>
              </div>
            )}
          </div>
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

          {producto.cantidad !== undefined && !noDisponible && (
            <p className="detalle-stock">
              {`Stock disponible: ${producto.cantidad} unidades`}
            </p>
          )}

          {usuario?.rol !== 'admin' && (
            <button
              className="detalle-btn"
              disabled={noDisponible}
              onClick={handleAgregar}
            >
              {noDisponible ? 'Sin stock' : agregado ? '¡Agregado!' : 'Agregar al carrito'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default ProductDetailPage;
