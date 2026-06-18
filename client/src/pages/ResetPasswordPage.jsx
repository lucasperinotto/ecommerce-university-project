import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { useToast } from '../context/ToastContext';
import useTitulo from '../hooks/useTitulo';

const OjoAbierto = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const OjoCerrado = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function ResetPasswordPage() {
  useTitulo('Nueva contraseña');
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ nuevaContrasena: '', confirmar: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [verNueva, setVerNueva] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.nuevaContrasena !== form.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (form.nuevaContrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setCargando(true);
    try {
      await resetPassword(token, form.nuevaContrasena, form.confirmar);
      showToast('¡Contraseña actualizada! Ya podés iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'El enlace es inválido o expiró.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-box">
        <h1 className="auth-titulo">Nueva contraseña</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nuevaContrasena">Nueva contraseña</label>
            <div className="input-password-wrap">
              <input
                id="nuevaContrasena"
                type={verNueva ? 'text' : 'password'}
                name="nuevaContrasena"
                value={form.nuevaContrasena}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-password-toggle"
                onClick={() => setVerNueva((v) => !v)}
                tabIndex={-1}
                aria-label={verNueva ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {verNueva ? <OjoAbierto /> : <OjoCerrado />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmar">Confirmar contraseña</label>
            <div className="input-password-wrap">
              <input
                id="confirmar"
                type={verConfirmar ? 'text' : 'password'}
                name="confirmar"
                value={form.confirmar}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-password-toggle"
                onClick={() => setVerConfirmar((v) => !v)}
                tabIndex={-1}
                aria-label={verConfirmar ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {verConfirmar ? <OjoAbierto /> : <OjoCerrado />}
              </button>
            </div>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={cargando}>
            {cargando ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
