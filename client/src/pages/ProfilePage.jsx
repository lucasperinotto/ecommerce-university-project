import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/usuariosService';
import './ProfilePage.css';

function ProfilePage() {
  const { usuario, actualizarUsuario } = useAuth();
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setCargando(true);
    try {
      const { data } = await updateProfile(usuario._id, form);
      actualizarUsuario({ nombre: data.nombre, apellido: data.apellido });
      setMensaje('Datos actualizados correctamente.');
      setEditando(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar los datos.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="perfil-container">
      <div className="perfil-box">
        <h1 className="auth-titulo">Mi perfil</h1>

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
              <span className="perfil-label">Correo</span>
              <span className="perfil-valor">{usuario?.mail}</span>
            </div>
            <div className="perfil-fila">
              <span className="perfil-label">Rol</span>
              <span className="perfil-valor perfil-rol">{usuario?.rol}</span>
            </div>
            {mensaje && <p className="auth-success">{mensaje}</p>}
            <button
              className="auth-btn"
              onClick={() => { setEditando(true); setMensaje(''); }}
            >
              Editar datos
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
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
      </div>
    </main>
  );
}

export default ProfilePage;
