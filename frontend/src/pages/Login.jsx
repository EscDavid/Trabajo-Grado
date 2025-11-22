import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(formData.username, formData.password);

      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('savedUsername', formData.username);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('savedUsername');
        }

        navigate('/dashboard');
      } else {
        setError(result.message || 'Error al iniciar sesión');
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authService.isAuthenticated()) navigate('/dashboard');
  }, [navigate]);

  useEffect(() => {
    const savedUsername = localStorage.getItem('savedUsername');
    const remembered = localStorage.getItem('rememberMe') === 'true';

    if (remembered && savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Bienvenido</h2>
        <p className="subtitle">Accede a tu cuenta</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="text"
              name="username"
              placeholder="Correo electrónico"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Recordarme</span>
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="links">
          <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
          <a href="/change-company" className="alt">Cambiar de empresa</a>
        </div>
      </div>
    </div>
  );
}
