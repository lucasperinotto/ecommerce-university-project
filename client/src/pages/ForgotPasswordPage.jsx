import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import { useToast } from '../context/ToastContext';
import useTitulo from '../hooks/useTitulo';

function ForgotPasswordPage() {
  useTitulo('Recuperar contraseña');
  const { showToast } = useToast();
  const [mail, setMail] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await forgotPassword(mail);
      setEnviado(true);
      showToast('¡Enlace enviado! Revisá tu correo electrónico.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el correo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-box">
        <h1 className="auth-titulo">Recuperar contraseña</h1>
        <p style={{ textAlign: 'center', color: 'var(--gris-medio)', marginBottom: '28px', fontSize: '0.9rem' }}>
          Ingresá tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        {enviado ? (
          <p className="auth-success">Revisá tu bandeja de entrada. Si el correo está registrado, vas a recibir el enlace en unos minutos.</p>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="mail">Correo electrónico <span className="campo-requerido">*</span></label>
              <input
                id="mail"
                type="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="auth-btn" disabled={cargando}>
              {cargando ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}
        <div className="auth-links">
          <Link to="/login">← Volver al inicio de sesión</Link>
        </div>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
