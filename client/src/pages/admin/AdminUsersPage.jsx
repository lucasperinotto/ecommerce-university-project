import { Fragment, useEffect, useState } from 'react';
import { getAll, updateProfile, crearUsuario, deleteUser, restoreUser } from '../../services/usuariosService';
import Spinner from '../../components/Spinner';
import ModalConfirm from '../../components/ModalConfirm';
import { useToast } from '../../context/ToastContext';
import useTitulo from '../../hooks/useTitulo';
import { soloLetras } from '../../utils/inputFilters';
import './AdminPage.css';

const FORM_VACIO = { nombre: '', apellido: '' };
const FORM_NUEVO_VACIO = { nombre: '', apellido: '', mail: '', contrasena: '', confirmar: '', rol: 'cliente' };

function AdminUsersPage() {
  useTitulo('Admin - Usuarios');
  const { showToast } = useToast();
  const [modal, setModal] = useState(null);
  const confirmar = (mensaje, accion) => setModal({ mensaje, accion });
  const cerrarModal = () => setModal(null);
  const ejecutar = () => { modal.accion(); cerrarModal(); };
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [formError, setFormError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [creandoNuevo, setCreandoNuevo] = useState(false);
  const [formNuevo, setFormNuevo] = useState(FORM_NUEVO_VACIO);
  const [formNuevoError, setFormNuevoError] = useState('');
  const [guardandoNuevo, setGuardandoNuevo] = useState(false);

  const fetchUsuarios = async () => {
    try {
      const { data } = await getAll();
      setUsuarios(data);
    } catch {
      setError('Error al cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: soloLetras(e.target.value) });

  const abrirEditar = (usuario) => {
    setForm({ nombre: usuario.nombre, apellido: usuario.apellido });
    setEditandoId(usuario._id);
    setFormError('');
  };

  const cancelar = () => {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setGuardando(true);
    try {
      await updateProfile(editandoId, form);
      await fetchUsuarios();
      cancelar();
      showToast('Usuario actualizado con éxito.');
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al actualizar el usuario.');
    } finally {
      setGuardando(false);
    }
  };

  const handleBaja = (id) => {
    confirmar('¿Dar de baja este usuario?', async () => {
      try {
        await deleteUser(id);
        await fetchUsuarios();
        showToast('Usuario dado de baja.');
      } catch {
        showToast('Error al dar de baja el usuario.', 'error');
      }
    });
  };

  const handleCrearNuevo = async (e) => {
    e.preventDefault();
    setFormNuevoError('');
    if (formNuevo.contrasena !== formNuevo.confirmar) {
      setFormNuevoError('Las contraseñas no coinciden.');
      return;
    }
    setGuardandoNuevo(true);
    try {
      await crearUsuario(formNuevo);
      await fetchUsuarios();
      setCreandoNuevo(false);
      setFormNuevo(FORM_NUEVO_VACIO);
      showToast('Usuario creado con éxito.');
    } catch (err) {
      setFormNuevoError(err.response?.data?.error || 'Error al crear el usuario.');
    } finally {
      setGuardandoNuevo(false);
    }
  };

  const handleRestaurar = async (id) => {
    try {
      await restoreUser(id);
      await fetchUsuarios();
      showToast('Usuario restaurado con éxito.');
    } catch {
      showToast('Error al restaurar el usuario.', 'error');
    }
  };

  if (cargando) return <Spinner texto="Cargando usuarios..." />;
  if (error) return <p className="pagina-estado pagina-error">{error}</p>;

  return (
    <main className="admin-page">
      {modal && <ModalConfirm mensaje={modal.mensaje} onConfirmar={ejecutar} onCancelar={cerrarModal} />}
      <div className="admin-header">
        <h1>Gestión de usuarios</h1>
        <button className="admin-btn-nuevo" onClick={() => { setCreandoNuevo(true); setFormNuevoError(''); }}>
          + Nuevo usuario
        </button>
      </div>

      {creandoNuevo && (
        <div className="admin-form-wrap">
          <h2>Nuevo usuario</h2>
          <form onSubmit={handleCrearNuevo} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre <span className="campo-requerido">*</span></label>
                <input name="nombre" value={formNuevo.nombre} onChange={(e) => setFormNuevo({ ...formNuevo, nombre: soloLetras(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>Apellido <span className="campo-requerido">*</span></label>
                <input name="apellido" value={formNuevo.apellido} onChange={(e) => setFormNuevo({ ...formNuevo, apellido: soloLetras(e.target.value) })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Correo electrónico <span className="campo-requerido">*</span></label>
              <input type="email" name="mail" value={formNuevo.mail} onChange={(e) => setFormNuevo({ ...formNuevo, mail: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contraseña <span className="campo-requerido">*</span></label>
                <input type="password" name="contrasena" value={formNuevo.contrasena} onChange={(e) => setFormNuevo({ ...formNuevo, contrasena: e.target.value })} required minLength={6} />
              </div>
              <div className="form-group">
                <label>Confirmar contraseña <span className="campo-requerido">*</span></label>
                <input type="password" name="confirmar" value={formNuevo.confirmar} onChange={(e) => setFormNuevo({ ...formNuevo, confirmar: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select name="rol" value={formNuevo.rol} onChange={(e) => setFormNuevo({ ...formNuevo, rol: e.target.value })}>
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {formNuevoError && <p className="auth-error">{formNuevoError}</p>}
            <div className="admin-form-acciones">
              <button type="submit" className="admin-btn-guardar" disabled={guardandoNuevo}>
                {guardandoNuevo ? 'Guardando...' : 'Crear usuario'}
              </button>
              <button type="button" className="admin-btn-cancelar" onClick={() => { setCreandoNuevo(false); setFormNuevo(FORM_NUEVO_VACIO); }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-tabla-wrap">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <Fragment key={u._id}>
                <tr className={u.estado === 'inactivo' ? 'fila-inactiva' : ''}>
                  <td>{u.nombre}</td>
                  <td>{u.apellido}</td>
                  <td>{u.mail}</td>
                  <td>
                    <span className={`admin-badge ${u.rol === 'admin' ? 'badge-admin' : 'badge-activo'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${u.estado === 'activo' ? 'badge-activo' : 'badge-inactivo'}`}>
                      {u.estado}
                    </span>
                  </td>
                  <td className="admin-acciones">
                    {u.estado === 'activo' ? (
                      <>
                        <button className="admin-btn-accion" onClick={() => abrirEditar(u)}>
                          Editar
                        </button>
                        <button className="admin-btn-baja" onClick={() => handleBaja(u._id)}>
                          Dar de baja
                        </button>
                      </>
                    ) : (
                      <button className="admin-btn-restaurar" onClick={() => handleRestaurar(u._id)}>
                        Restaurar
                      </button>
                    )}
                  </td>
                </tr>
                {editandoId === u._id && (
                  <tr className="fila-form">
                    <td colSpan={6}>
                      <form onSubmit={handleSubmit} className="admin-inline-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Nombre <span className="campo-requerido">*</span></label>
                            <input name="nombre" value={form.nombre} onChange={handleChange} required />
                          </div>
                          <div className="form-group">
                            <label>Apellido <span className="campo-requerido">*</span></label>
                            <input name="apellido" value={form.apellido} onChange={handleChange} required />
                          </div>
                        </div>
                        {formError && <p className="auth-error">{formError}</p>}
                        <div className="admin-form-acciones">
                          <button type="submit" className="admin-btn-guardar" disabled={guardando}>
                            {guardando ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button type="button" className="admin-btn-cancelar" onClick={cancelar}>
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminUsersPage;
