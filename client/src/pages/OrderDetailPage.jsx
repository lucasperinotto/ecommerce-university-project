import { useLocation, useNavigate } from 'react-router-dom';
import './OrderDetailPage.css';

function OrderDetailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orden = state?.orden;

  if (!orden) {
    navigate('/mis-ordenes');
    return null;
  }

  const { _id, estado, fechaCreacion, metodoPago, direccionEnvio, items, precioTotal } = orden;

  return (
    <main className="orden-detalle">
      <button className="orden-detalle-volver" onClick={() => navigate('/mis-ordenes')}>
        ← Volver a mis órdenes
      </button>

      <div className="orden-detalle-header">
        <h1 className="orden-detalle-titulo">
          Orden <span>#{_id?.slice(-8)}</span>
        </h1>
        <span className={`orden-estado orden-estado--${estado?.replace(/ /g, '-')}`}>
          {estado}
        </span>
      </div>

      <div className="orden-detalle-contenido">
        <div className="orden-detalle-items">
          <h2>Productos</h2>
          {items?.map((item, i) => (
            <div key={i} className="orden-detalle-item">
              <span className="orden-detalle-item-nombre">
                {item.nombre || item.idProducto || item.producto}
              </span>
              <span className="orden-detalle-item-cant">× {item.cantidad}</span>
              {item.precio && (
                <span className="orden-detalle-item-precio">
                  ${Number(item.precio * item.cantidad).toLocaleString('es-AR')}
                </span>
              )}
            </div>
          ))}
          <div className="orden-detalle-total">
            <span>Total</span>
            <span>${Number(precioTotal).toLocaleString('es-AR')}</span>
          </div>
        </div>

        <div className="orden-detalle-info">
          <div className="orden-detalle-seccion">
            <h2>Dirección de envío</h2>
            {direccionEnvio ? (
              <p>
                {direccionEnvio.calle} {direccionEnvio.numero},{' '}
                {direccionEnvio.ciudad}, {direccionEnvio.provincia}{' '}
                ({direccionEnvio.codigoPostal})
              </p>
            ) : (
              <p className="orden-detalle-sin-dato">—</p>
            )}
          </div>
          <div className="orden-detalle-seccion">
            <h2>Método de pago</h2>
            <p>{metodoPago}</p>
          </div>
          <div className="orden-detalle-seccion">
            <h2>Fecha</h2>
            <p>
              {fechaCreacion
                ? new Date(fechaCreacion).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderDetailPage;
