import { API } from './api';

export const authService = {
  /**
   * Iniciar sesión
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise} Respuesta del servidor
   */
  async login(username, password) {
    try {
      const response = await API.post('/api/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        // Guardar tokens en localStorage
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        return {
          success: true,
          data: response.data.data
        };
      }

      return {
        success: false,
        message: response.data.message || 'Error al iniciar sesión'
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al conectar con el servidor'
      };
    }
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      await API.post('/api/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  /**
   * Obtener información del usuario autenticado
   */
  async getMe() {
    try {
      const response = await API.get('/api/auth/me');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener información del usuario'
      };
    }
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Obtener el token de acceso
   */
  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  /**
   * Obtener el usuario actual
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};







