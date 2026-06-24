import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMisOrdenes } from '../services/ordenesService';
import Spinner from '../components/Spinner';
import useTitulo from '../hooks/useTitulo';
import { labelEstado } from '../utils/ordenLabels';
import './OrdersPage.css';

function OrdersPage() {
  useTitulo('Mis pedidos');
  const { usuario } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const { data } = await getMisOrdenes(usuario._id);
        setOrdenes(Array.isArray(data) ? data : [data]);
      } catch (err) {
        if (err.response?.status === 404) {
          setOrdenes([]);
        } else {
          setError('No se pudieron cargar las órdenes.');
        }
      } finally {
        setCargando(false);
      }
    };
    fetchOrdenes();
  }, [usuario._id]);

  if (cargando) return <Spinner texto="Cargando órdenes..." />;
  if (error) return <p className="pagina-estado pagina-error">{error}</p>;

  return (
    <main className="ordenes">
      <Link to="/perfil" className="ordenes-volver">
        ← Volver a mi perfil
      </Link>
      <h1 className="ordenes-titulo">Mis pedidos</h1>

      {ordenes.length === 0 ? (
        <div className="ordenes-vacio">
          <p>Todavía no realizaste ninguna compra.</p>
          <Link to="/catalogo" className="ordenes-btn-catalogo">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="ordenes-lista">
          {ordenes.map((orden) => (
            <Link
              key={orden._id}
              to={`/mis-ordenes/${orden._id}`}
              state={{ orden }}
              className="orden-card"
            >
              <div className="orden-card-header">
                <span className="orden-id">Orden #{orden._id?.slice(-8)}</span>
                <span className={`orden-estado orden-estado--${orden.estado?.replace(/ /g, '-')}`}>
                  {labelEstado(orden.estado)}
                </span>
              </div>
              <div className="orden-card-body">
                <p className="orden-fecha">
                  {orden.createdAt
                    ? new Date(orden.createdAt).toLocaleDateString('es-AR')
                    : '—'}
                </p>
                <p className="orden-items">
                  {orden.items?.length ?? 0} producto{orden.items?.length !== 1 ? 's' : ''}
                </p>
                <p className="orden-total">
                  ${Number(orden.precioTotal).toLocaleString('es-AR')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default OrdersPage;
