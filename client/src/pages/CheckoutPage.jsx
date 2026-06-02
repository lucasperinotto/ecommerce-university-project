import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { crearOrden } from '../services/ordenesService';
import { ajustarStock } from '../services/productosService';
import './CheckoutPage.css';

const DATOS_BANCARIOS = {
  banco: 'Banco Nación',
  titular: 'Sabina Accesorios S.R.L.',
  cbu: '0110000000000000000001',
  alias: 'SABINA.ACCESORIOS',
};

const facturacionVacia = { nombreCompleto: '', dni: '', domicilio: '' };
const envioVacio = { calle: '', numero: '', ciudad: '', provincia: '', codigoPostal: '' };

function CheckoutPage() {
  const { items, total, vaciarCarrito } = useCarrito();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [facturacion, setFacturacion] = useState(facturacionVacia);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [tipoEntrega, setTipoEntrega] = useState('retiro');
  const [usarDomFact, setUsarDomFact] = useState(false);
  const [envio, setEnvio] = useState(envioVacio);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [ordenConfirmada, setOrdenConfirmada] = useState(null);

  if (items.length === 0 && !ordenConfirmada) {
    navigate('/carrito');
    return null;
  }

  const handleFact = (e) => setFacturacion({ ...facturacion, [e.target.name]: e.target.value });
  const handleEnvio = (e) => setEnvio({ ...envio, [e.target.name]: e.target.value });

  const handleUsarDomFact = (e) => {
    setUsarDomFact(e.target.checked);
    if (e.target.checked) {
      const partes = facturacion.domicilio.split(',');
      setEnvio({
        calle: partes[0]?.trim() || facturacion.domicilio,
        numero: '',
        ciudad: partes[1]?.trim() || '',
        provincia: partes[2]?.trim() || '',
        codigoPostal: '',
      });
    } else {
      setEnvio(envioVacio);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const itemsOrden = items.map((i) => ({
        idProducto: i._id,
        nombre: i.nombre,
        precio: i.precio,
        cantidad: i.cantidad,
      }));

      const payload = {
        idUsuario: usuario._id,
        items: itemsOrden,
        precioTotal: total,
        metodoPago,
        tipoEntrega,
        datosFacturacion: facturacion,
        ...(tipoEntrega === 'envio' && {
          direccionEnvio: {
            calle: envio.calle,
            numero: Number(envio.numero) || 0,
            ciudad: envio.ciudad,
            provincia: envio.provincia,
            codigoPostal: envio.codigoPostal,
          },
        }),
      };

      const { data } = await crearOrden(payload);
      await Promise.allSettled(
        items.map((i) => ajustarStock(i._id, -i.cantidad))
      );
      vaciarCarrito();
      setOrdenConfirmada(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al generar la orden.');
    } finally {
      setCargando(false);
    }
  };

  /* ── Pantalla de confirmación ── */
  if (ordenConfirmada) {
    return (
      <main className="checkout">
        <div className="checkout-confirmacion">
          <div className="checkout-confirmacion-icono">✓</div>
          <h1>¡Orden confirmada!</h1>
          <p className="checkout-confirmacion-sub">
            Gracias por tu compra, {usuario?.nombre}. Tu número de orden es{' '}
            <strong>#{ordenConfirmada._id?.slice(-8) ?? '—'}</strong>.
          </p>

          {metodoPago === 'transferencia' && (
            <div className="checkout-datos-bancarios">
              <h2>Datos para la transferencia</h2>
              <p>Realizá la transferencia por el monto total y envianos el comprobante.</p>
              <ul>
                <li><span>Banco</span><strong>{DATOS_BANCARIOS.banco}</strong></li>
                <li><span>Titular</span><strong>{DATOS_BANCARIOS.titular}</strong></li>
                <li><span>CBU</span><strong>{DATOS_BANCARIOS.cbu}</strong></li>
                <li><span>Alias</span><strong>{DATOS_BANCARIOS.alias}</strong></li>
                <li><span>Monto</span><strong>${Number(total).toLocaleString('es-AR')}</strong></li>
              </ul>
            </div>
          )}

          {metodoPago === 'efectivo' && tipoEntrega === 'retiro' && (
            <p className="checkout-confirmacion-nota">
              Podés pasar a retirar tu pedido y abonar en efectivo en nuestro local.
            </p>
          )}

          {metodoPago === 'efectivo' && tipoEntrega === 'envio' && (
            <p className="checkout-confirmacion-nota">
              Abonás en efectivo al momento de la entrega.
            </p>
          )}

          <div className="checkout-confirmacion-acciones">
            <Link to="/mis-ordenes" className="auth-btn checkout-btn-ordenes">
              Ver mis órdenes
            </Link>
            <Link to="/catalogo" className="checkout-btn-seguir">
              Seguir comprando
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ── Usuario no logueado ── */
  if (!usuario) {
    return (
      <main className="checkout">
        <h1 className="checkout-titulo">Confirmar compra</h1>
        <div className="checkout-no-auth">
          <p>Para continuar con tu compra necesitás iniciar sesión o crear una cuenta.</p>
          <div className="checkout-no-auth-btns">
            <Link to="/login" state={{ from: '/checkout' }} className="auth-btn">
              Iniciar sesión
            </Link>
            <Link to="/registro" state={{ from: '/checkout' }} className="checkout-btn-registro">
              Crear cuenta
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ── Formulario principal ── */
  return (
    <main className="checkout">
      <h1 className="checkout-titulo">Confirmar compra</h1>

      <div className="checkout-contenido">
        <form onSubmit={handleSubmit} className="checkout-form">

          {/* Datos de facturación */}
          <section className="checkout-seccion">
            <h2>Datos de facturación</h2>
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                name="nombreCompleto"
                value={facturacion.nombreCompleto}
                onChange={handleFact}
                required
                placeholder={`${usuario.nombre} ${usuario.apellido}`}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>DNI</label>
                <input
                  name="dni"
                  value={facturacion.dni}
                  onChange={handleFact}
                  required
                  placeholder="Ej: 40123456"
                />
              </div>
              <div className="form-group">
                <label>Domicilio</label>
                <input
                  name="domicilio"
                  value={facturacion.domicilio}
                  onChange={handleFact}
                  required
                  placeholder="Calle, ciudad, provincia"
                />
              </div>
            </div>
          </section>

          {/* Método de pago */}
          <section className="checkout-seccion">
            <h2>Método de pago</h2>
            <div className="checkout-metodos">
              {[
                { valor: 'transferencia', etiqueta: 'Transferencia bancaria' },
                { valor: 'efectivo', etiqueta: 'Efectivo' },
              ].map(({ valor, etiqueta }) => (
                <label
                  key={valor}
                  className={`checkout-metodo ${metodoPago === valor ? 'activo' : ''}`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value={valor}
                    checked={metodoPago === valor}
                    onChange={() => setMetodoPago(valor)}
                  />
                  {etiqueta}
                </label>
              ))}
            </div>
            {metodoPago === 'transferencia' && (
              <p className="checkout-info-pago">
                Una vez confirmada la orden te mostramos los datos bancarios para realizar la transferencia.
              </p>
            )}
          </section>

          {/* Tipo de entrega */}
          <section className="checkout-seccion">
            <h2>Entrega</h2>
            <div className="checkout-metodos">
              {[
                { valor: 'retiro', etiqueta: 'Retiro en local' },
                { valor: 'envio', etiqueta: 'Envío a domicilio' },
              ].map(({ valor, etiqueta }) => (
                <label
                  key={valor}
                  className={`checkout-metodo ${tipoEntrega === valor ? 'activo' : ''}`}
                >
                  <input
                    type="radio"
                    name="tipoEntrega"
                    value={valor}
                    checked={tipoEntrega === valor}
                    onChange={() => {
                      setTipoEntrega(valor);
                      setUsarDomFact(false);
                      setEnvio(envioVacio);
                    }}
                  />
                  {etiqueta}
                </label>
              ))}
            </div>

            {tipoEntrega === 'envio' && (
              <div className="checkout-envio">
                <label className="checkout-checkbox">
                  <input
                    type="checkbox"
                    checked={usarDomFact}
                    onChange={handleUsarDomFact}
                  />
                  Usar domicilio de facturación
                </label>

                {!usarDomFact && (
                  <div className="checkout-envio-campos">
                    <div className="form-group">
                      <label>Calle</label>
                      <input
                        name="calle"
                        value={envio.calle}
                        onChange={handleEnvio}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Número</label>
                        <input
                          name="numero"
                          type="number"
                          value={envio.numero}
                          onChange={handleEnvio}
                          required
                          min={1}
                        />
                      </div>
                      <div className="form-group">
                        <label>Código postal</label>
                        <input
                          name="codigoPostal"
                          value={envio.codigoPostal}
                          onChange={handleEnvio}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Ciudad</label>
                        <input
                          name="ciudad"
                          value={envio.ciudad}
                          onChange={handleEnvio}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Provincia</label>
                        <input
                          name="provincia"
                          value={envio.provincia}
                          onChange={handleEnvio}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={cargando}>
            {cargando ? 'Procesando...' : 'Confirmar orden'}
          </button>
        </form>

        {/* Resumen del pedido */}
        <div className="checkout-resumen">
          <h2>Tu pedido</h2>
          {items.map((item) => (
            <div key={item._id} className="checkout-item">
              <span className="checkout-item-nombre">
                {item.nombre}{' '}
                <span className="checkout-item-cantidad">× {item.cantidad}</span>
              </span>
              <span>${Number(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
            </div>
          ))}
          <div className="checkout-total">
            <span>Total</span>
            <span>${Number(total).toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;
