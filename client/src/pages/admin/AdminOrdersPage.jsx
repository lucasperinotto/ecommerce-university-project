import { useEffect, useState } from 'react';
import { getTodasOrdenes } from '../../services/ordenesService';
import './AdminPage.css';

function AdminOrdersPage() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const { data } = await getTodasOrdenes();
        setOrdenes(Array.isArray(data) ? data : []);
      } catch {
        setError('Error al cargar las órdenes.');
      } finally {
        setCargando(false);
      }
    };
    fetchOrdenes();
  }, []);

  if (cargando) return <p className="pagina-estado">Cargando órdenes...</p>;
  if (error) return <p className="pagina-estado pagina-error">{error}</p>;

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Órdenes de compra</h1>
      </div>

      {ordenes.length === 0 ? (
        <p className="pagina-estado">No hay órdenes registradas.</p>
      ) : (
        <div className="admin-tabla-wrap">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Método de pago</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o._id}>
                  <td className="orden-id-col">#{o._id?.slice(-8)}</td>
                  <td>{o.idUsuario || o.usuario || '—'}</td>
                  <td>{o.items?.length ?? 0} item{o.items?.length !== 1 ? 's' : ''}</td>
                  <td>${Number(o.precioTotal).toLocaleString('es-AR')}</td>
                  <td>{o.metodoPago}</td>
                  <td>
                    <span className={`admin-badge orden-estado--${o.estado?.replace(/ /g, '-')}`}>
                      {o.estado}
                    </span>
                  </td>
                  <td>
                    {o.fechaCreacion
                      ? new Date(o.fechaCreacion).toLocaleDateString('es-AR')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default AdminOrdersPage;
