import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './Button';
import Toast from './Toast';
import { useAuth } from '../context/AuthContext';

const LoginForm = ({ onClose }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    // Agregar clase para prevenir scroll cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    // Activar la animación después de montar el componente
    setTimeout(() => setIsVisible(true), 50);

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Esperar a que termine la animación
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/users/login', {
        identifier,
        password
      });
      login(response.data);
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay con fade */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Panel lateral */}
      <div 
        className={`w-full max-w-md bg-dark-800 h-[calc(100vh-4rem)] mt-16 shadow-xl transform transition-transform duration-300 ease-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto px-8 py-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-white">Iniciar Sesión</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Correo o Documento
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-md text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ingrese su correo o documento"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-md text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {error && (
            <Toast
              message={error}
              type="error"
              onClose={() => setError(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
