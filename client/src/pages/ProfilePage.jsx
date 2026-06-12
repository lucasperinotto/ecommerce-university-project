import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateProfile } from '../services/usuariosService';
import { getMisOrdenes } from '../services/ordenesService';
import Spinner from '../components/Spinner';
import './ProfilePage.css';

function ProfilePage() {
  const { usuario, actualizarUsuario } = useAuth();
  const { showToast } = useToast();
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [ordenes, setOrdenes] = useState([]);
  const [cargandoOrdenes, setCargandoOrdenes] = useState(true);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const { data } = await getMisOrdenes(usuario._id);
        const lista = Array.isArray(data) ? data : [data];
        setOrdenes(lista.slice(0, 5));
      } catch {
        setOrdenes([]);
      } finally {
        setCargandoOrdenes(false);
      }
    };
    fetchOrdenes();
  }, [usuario._id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const { data } = await updateProfile(usuario._id, form);
      actualizarUsuario({ nombre: data.nombre, apellido: data.apellido });
      showToast('Datos actualizados correctamente.');
      setEditando(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar los datos.');
    } finally {
      setCargando(false);
    }
  };

  const iniciales = `${usuario?.nombre?.[0] || ''}${usuario?.apellido?.[0] || ''}`.toUpperCase();

  const labelEstado = (estado) => {
    const map = {
      pendiente: 'Pendiente',
      'en preparación': 'En preparación',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
    };
    return map[estado] || estado;
  };

  return (
    <main className="perfil-container">

      {/* Header */}
      <div className="perfil-header">
        <div className="perfil-avatar">{iniciales}</div>
        <div className="perfil-header-info">
          <h1 className="perfil-nombre-completo">
            {usuario?.nombre} {usuario?.apellido}
          </h1>
          <span className="perfil-rol">{usuario?.rol}</span>
        </div>
      </div>

      <div className="perfil-cuerpo">

        {/* Datos personales */}
        <section className="perfil-seccion">
          <div className="perfil-seccion-titulo">
            <h2>Datos personales</h2>
            {!editando && (
              <button
                className="perfil-btn-editar"
                onClick={() => { setEditando(true); setError(''); }}
              >
                Editar
              </button>
            )}
          </div>

          {!editando ? (
            <div className="perfil-datos">
              <div className="perfil-fila">
                <span className="perfil-label">Nombre</span>
                <span className="perfil-valor">{usuario?.nombre}</span>
              </div>
              <div className="perfil-fila">
                <span className="perfil-label">Apellido</span>
                <span className="perfil-valor">{usuario?.apellido}</span>
              </div>
              <div className="perfil-fila">
                <span className="perfil-label">Correo electrónico</span>
                <span className="perfil-valor">{usuario?.mail}</span>
              </div>
              <div className="perfil-fila">
                <span className="perfil-label">Rol</span>
                <span className="perfil-valor perfil-rol-fila">{usuario?.rol}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form perfil-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    id="apellido"
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {error && <p className="auth-error">{error}</p>}
              <div className="perfil-acciones">
                <button type="submit" className="auth-btn" disabled={cargando}>
                  {cargando ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  className="perfil-btn-cancelar"
                  onClick={() => setEditando(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Mis compras */}
        <section className="perfil-seccion">
          <div className="perfil-seccion-titulo">
            <h2>Mis compras</h2>
            {ordenes.length > 0 && (
              <Link to="/mis-ordenes" className="perfil-link-todas">
                Ver todas
              </Link>
            )}
          </div>

          {cargandoOrdenes ? (
            <Spinner pequeño texto="Cargando órdenes..." />
          ) : ordenes.length === 0 ? (
            <div className="perfil-sin-ordenes">
              <p>Todavía no realizaste ninguna compra.</p>
              <Link to="/catalogo" className="perfil-btn-catalogo">
                Ir al catálogo
              </Link>
            </div>
          ) : (
            <div className="perfil-ordenes">
              {ordenes.map((orden) => (
                <Link
                  key={orden._id}
                  to={`/mis-ordenes/${orden._id}`}
                  state={{ orden }}
                  className="perfil-orden-card"
                >
                  <div className="perfil-orden-top">
                    <span className="perfil-orden-id">Orden #{orden._id?.slice(-8)}</span>
                    <span className={`perfil-orden-estado perfil-orden-estado--${orden.estado?.replace(/ /g, '-')}`}>
                      {labelEstado(orden.estado)}
                    </span>
                  </div>
                  <div className="perfil-orden-bottom">
                    <span className="perfil-orden-fecha">
                      {orden.fechaCreacion
                        ? new Date(orden.fechaCreacion).toLocaleDateString('es-AR', {
                            day: '2-digit', month: 'long', year: 'numeric',
                          })
                        : '—'}
                    </span>
                    <span className="perfil-orden-items">
                      {orden.items?.length ?? 0} producto{orden.items?.length !== 1 ? 's' : ''}
                    </span>
                    <span className="perfil-orden-total">
                      ${Number(orden.precioTotal).toLocaleString('es-AR')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default ProfilePage;
