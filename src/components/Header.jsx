import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import LoginForm from './LoginForm';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-dark-800 shadow-lg mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {user ? (
            <>
              <div className="flex space-x-8 items-center">
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Inicio
                </Link>
                <Link 
                  to="/dashboard/users" 
                  className="text-white hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Usuarios
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.first_name ? `${user.first_name[0].toUpperCase()}${user.last_name[0].toUpperCase()}` : 'U'}
                  </span>
                </div>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </div>
            </>
          ) : (
            <div className="flex justify-end w-full items-center">
              <Button variant="primary" size="sm" onClick={() => setShowLoginForm(true)}>
                Iniciar Sesión
              </Button>
            </div>
          )}
        </div>
      </div>

      {showLoginForm && (
        <LoginForm onClose={() => setShowLoginForm(false)} />
      )}
    </nav>
  );
};

export default Header;
