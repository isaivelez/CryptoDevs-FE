import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../design-system/Button';
import LoginForm from '../../auth/components/LoginForm';
import { useAuth } from '../../auth/context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-dark-800 shadow-lg mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-primary font-bold text-xl">
              CryptoDevs
            </Link>
          </div>

          {user ? (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8 items-center">
                <Link 
                  to="/dashboard/empleados" 
                  className="text-white hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Empleados
                </Link>
                <Link 
                  to="/dashboard/visitantes" 
                  className="text-white hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Visitantes
                </Link>
                <Link 
                  to="/dashboard/reportes" 
                  className="text-white hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Reportes
                </Link>
              </div>

              {/* User Profile & Logout (Desktop) */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.first_name ? `${user.first_name[0].toUpperCase()}${user.last_name[0].toUpperCase()}` : 'U'}
                  </span>
                </div>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  {mobileMenuOpen ? (
                    <FaTimes className="h-6 w-6" />
                  ) : (
                    <FaBars className="h-6 w-6" />
                  )}
                </button>
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

      {/* Mobile Menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden bg-dark-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/dashboard/empleados" 
              className="text-white hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Empleados
            </Link>
            <Link 
              to="/dashboard/visitantes" 
              className="text-white hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Visitantes
            </Link>
            <Link 
              to="/dashboard/reportes" 
              className="text-white hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reportes
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-dark-600">
            <div className="flex items-center px-5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user.first_name ? `${user.first_name[0].toUpperCase()}${user.last_name[0].toUpperCase()}` : 'U'}
                </span>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-sm font-medium text-gray-400">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      )}

      {showLoginForm && (
        <LoginForm onClose={() => setShowLoginForm(false)} />
      )}
    </nav>
  );
};

export default Header;
