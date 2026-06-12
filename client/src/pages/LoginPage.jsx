import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from || '/';
  const [form, setForm] = useState({ mail: '', contrasena: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [verContrasena, setVerContrasena] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const data = await login(form.mail, form.contrasena);
      showToast(`¡Bienvenida de vuelta, ${data.usuario?.nombre || ''}!`);
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
            <div className="input-password-wrap">
              <input
                id="contrasena"
                type={verContrasena ? 'text' : 'password'}
                name="contrasena"
                value={form.contrasena}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-password-toggle"
                onClick={() => setVerContrasena((v) => !v)}
                tabIndex={-1}
                aria-label={verContrasena ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {verContrasena ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
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
