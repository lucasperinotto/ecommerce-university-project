import { Fragment, useEffect, useState } from 'react';
import { getAll, updateProfile, deleteUser, restoreUser } from '../../services/usuariosService';
import Spinner from '../../components/Spinner';
import './AdminPage.css';

const FORM_VACIO = { nombre: '', apellido: '' };

function AdminUsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [formError, setFormError] = useState('');
  const [guardando, setGuardando] = useState(false);

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al actualizar el usuario.');
    } finally {
      setGuardando(false);
    }
  };

  const handleBaja = async (id) => {
    if (!confirm('¿Dar de baja este usuario?')) return;
    try {
      await deleteUser(id);
      await fetchUsuarios();
    } catch {
      alert('Error al dar de baja el usuario.');
    }
  };

  const handleRestaurar = async (id) => {
    try {
      await restoreUser(id);
      await fetchUsuarios();
    } catch {
      alert('Error al restaurar el usuario.');
    }
  };

  if (cargando) return <Spinner texto="Cargando usuarios..." />;
  if (error) return <p className="pagina-estado pagina-error">{error}</p>;

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Gestión de usuarios</h1>
      </div>

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
                            <label>Nombre</label>
                            <input name="nombre" value={form.nombre} onChange={handleChange} required />
                          </div>
                          <div className="form-group">
                            <label>Apellido</label>
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
