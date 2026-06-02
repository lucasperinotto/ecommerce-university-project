import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from || '/';
  const [form, setForm] = useState({ mail: '', contrasena: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(form.mail, form.contrasena);
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-box">
        <h1 className="auth-titulo">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="auth-form">
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
              autoComplete="current-password"
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
          <span>
            ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
          </span>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
