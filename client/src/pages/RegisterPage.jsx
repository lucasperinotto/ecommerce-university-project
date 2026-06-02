import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    mail: '',
    contrasena: '',
    confirmar: '',
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.contrasena !== form.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setCargando(true);
    try {
      const { nombre, apellido, mail, contrasena } = form;
      await register({ nombre, apellido, mail, contrasena });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-box">
        <h1 className="auth-titulo">Crear cuenta</h1>
        <form onSubmit={handleSubmit} className="auth-form">
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
          <div className="form-group">
            <label htmlFor="mail">Correo electrónico</label>
            <input
              id="mail"
              type="email"
              name="mail"
              value={form.mail}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmar">Confirmar contraseña</label>
            <input
              id="confirmar"
              type="password"
              name="confirmar"
              value={form.confirmar}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>
        <div className="auth-links">
          <span>
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </span>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
