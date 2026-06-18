import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { crearOrden } from '../services/ordenesService';
import { ajustarStock } from '../services/productosService';
import useTitulo from '../hooks/useTitulo';
import './CheckoutPage.css';

const DATOS_BANCARIOS = {
  banco: 'Banco Nación',
  titular: 'Sabina Accesorios S.R.L.',
  cbu: '0110000000000000000001',
  alias: 'SABINA.ACCESORIOS',
};

const PROVINCIAS = [
  'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Ciudad Autónoma de Buenos Aires',
  'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis',
  'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

const normalizar = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim();

const matchProvincia = (nombreApi) => {
  const norm = normalizar(nombreApi);
  return PROVINCIAS.find((p) => normalizar(p) === norm) || '';
};

const facturacionVacia = { nombre: '', apellido: '', dni: '', mail: '', direccion: '', pisoDepto: '', codigoPostal: '', ciudad: '', provincia: '', celular: '' };
const envioVacio = { calle: '', numero: '', ciudad: '', provincia: '', codigoPostal: '' };

function CheckoutPage() {
  useTitulo('Confirmar compra');
  const { items, total, vaciarCarrito } = useCarrito();
  const { usuario } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [facturacion, setFacturacion] = useState({
    ...facturacionVacia,
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    mail: usuario?.mail || '',
  });
  const [notas, setNotas] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [tipoEntrega, setTipoEntrega] = useState('retiro');
  const [usarDomFact, setUsarDomFact] = useState(false);
  const [domSeleccionado, setDomSeleccionado] = useState(null);
  const [envio, setEnvio] = useState(envioVacio);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [ordenConfirmada, setOrdenConfirmada] = useState(null);

  if (items.length === 0 && !ordenConfirmada) {
    navigate('/carrito');
    return null;
  }

  const capitalizar = (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  const buscarLocalidad = async (cp, setter) => {
    if (cp.length < 4) return;
    try {
      const res = await fetch(`https://api.zippopotam.us/AR/${cp}`);
      if (!res.ok) return;
      const json = await res.json();
      const lugar = json.places?.[0];
      if (lugar) {
        setter((prev) => ({
          ...prev,
          ciudad: capitalizar(lugar['place name']),
          provincia: matchProvincia(lugar['state']) || capitalizar(lugar['state']),
        }));
      }
    } catch (err) {
      console.error('Error al buscar localidad por código postal:', err);
      showToast('No se pudo autocompletar la localidad. Completala manualmente.', 'info');
    }
  };

  const handleFact = (e) => {
    const { name, value } = e.target;
    setFacturacion((prev) => ({ ...prev, [name]: value }));
    if (name === 'codigoPostal') buscarLocalidad(value, setFacturacion);
  };

  const handleEnvio = (e) => {
    const { name, value } = e.target;
    setEnvio((prev) => ({ ...prev, [name]: value }));
    if (name === 'codigoPostal') buscarLocalidad(value, setEnvio);
  };

  const handleUsarDomFact = (e) => {
    setUsarDomFact(e.target.checked);
    if (e.target.checked) {
      setEnvio({
        calle: facturacion.direccion,
        numero: '',
        ciudad: facturacion.ciudad,
        provincia: facturacion.provincia,
        codigoPostal: facturacion.codigoPostal,
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
        notas,
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
            <p className="checkout-nota-requerido">
              Los campos marcados con <span className="campo-requerido">*</span> son obligatorios.
            </p>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre <span className="campo-requerido">*</span></label>
                <input
                  name="nombre"
                  value={facturacion.nombre}
                  onChange={handleFact}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido <span className="campo-requerido">*</span></label>
                <input
                  name="apellido"
                  value={facturacion.apellido}
                  onChange={handleFact}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>DNI o CUIT <span className="campo-requerido">*</span></label>
                <input
                  name="dni"
                  value={facturacion.dni}
                  onChange={handleFact}
                  required
                  placeholder="Ej: 40123456"
                />
              </div>
              <div className="form-group">
                <label>Correo electrónico <span className="campo-requerido">*</span></label>
                <input
                  type="email"
                  name="mail"
                  value={facturacion.mail}
                  onChange={handleFact}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Dirección <span className="campo-requerido">*</span></label>
              <input
                name="direccion"
                value={facturacion.direccion}
                onChange={handleFact}
                required
                placeholder="Calle y número"
              />
            </div>
            <div className="form-group">
              <label>Piso, departamento, etc.</label>
              <input
                name="pisoDepto"
                value={facturacion.pisoDepto}
                onChange={handleFact}
                placeholder="Opcional"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Localidad <span className="campo-requerido">*</span></label>
                <input
                  name="ciudad"
                  value={facturacion.ciudad}
                  onChange={handleFact}
                  required
                />
              </div>
              <div className="form-group">
                <label>Provincia <span className="campo-requerido">*</span></label>
                <select
                  name="provincia"
                  value={facturacion.provincia}
                  onChange={handleFact}
                  required
                >
                  <option value="">Seleccioná una provincia</option>
                  {PROVINCIAS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Código postal <span className="campo-requerido">*</span></label>
                <input
                  name="codigoPostal"
                  value={facturacion.codigoPostal}
                  onChange={handleFact}
                  required
                  placeholder="Ej: 3260"
                  maxLength={8}
                />
                <span className="checkout-campo-ayuda">Solo números (sin letras)</span>
              </div>
              <div className="form-group">
                <label>Celular <span className="campo-requerido">*</span></label>
                <input
                  type="tel"
                  name="celular"
                  value={facturacion.celular}
                  onChange={handleFact}
                  required
                  placeholder="Ej: 3442123456"
                />
              </div>
            </div>
          </section>

          {/* Información adicional */}
          <section className="checkout-seccion">
            <h2>Información adicional</h2>
            <div className="form-group">
              <label>Notas para el pedido</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                placeholder="Datos adicionales para la entrega. Indicar en caso de necesitar factura A"
              />
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
                      setDomSeleccionado(null);
                    }}
                  />
                  {etiqueta}
                </label>
              ))}
            </div>

            {tipoEntrega === 'envio' && (
              <div className="checkout-envio">
                {usuario?.direcciones?.length > 0 && (
                  <div className="checkout-dom-guardados">
                    <p className="checkout-dom-label">Domicilios guardados:</p>
                    {usuario.direcciones.map((dir, idx) => (
                      <label
                        key={idx}
                        className={`checkout-metodo ${domSeleccionado === idx ? 'activo' : ''}`}
                      >
                        <input
                          type="radio"
                          name="domGuardado"
                          checked={domSeleccionado === idx}
                          onChange={() => {
                            setDomSeleccionado(idx);
                            setUsarDomFact(false);
                            setEnvio({
                              calle: dir.calle,
                              numero: String(dir.numero),
                              ciudad: dir.ciudad,
                              provincia: dir.provincia,
                              codigoPostal: dir.codigoPostal,
                            });
                          }}
                        />
                        {dir.calle} {dir.numero}, {dir.ciudad} ({dir.codigoPostal})
                      </label>
                    ))}
                  </div>
                )}

                <label className="checkout-checkbox">
                  <input
                    type="checkbox"
                    checked={usarDomFact}
                    onChange={(e) => { handleUsarDomFact(e); setDomSeleccionado(null); }}
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
              <span className="checkout-item-nombre">{item.nombre}</span>
              <span className="checkout-item-cantidad">× {item.cantidad}</span>
              <span className="checkout-item-precio">${Number(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
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
