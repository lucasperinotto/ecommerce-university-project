import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nuevaContrasena: '', confirmar: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

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
      await resetPassword(token, form.nuevaContrasena);
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
            <input
              id="nuevaContrasena"
              type="password"
              name="nuevaContrasena"
              value={form.nuevaContrasena}
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
            {cargando ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
