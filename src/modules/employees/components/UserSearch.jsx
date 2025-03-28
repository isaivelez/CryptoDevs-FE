import { useState } from 'react';
import axios from 'axios';
import Spinner from '../../core/design-system/Spinner';
import Toast from '../../core/design-system/Toast';
import Button from '../../core/design-system/Button';
import UserCard from './UserCard';

const UserSearch = () => {
  const [documentNumber, setDocumentNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!documentNumber.match(/^\d+$/)) {
      setError('Documento inválido, solo se permiten números.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://127.0.0.1:8000/users/${documentNumber}`);
      setUser(response.data);
    } catch (err) {
      console.log(err)
      setError(err?.response?.data?.detail || 'Error al buscar el usuario');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUser(null);
    setDocumentNumber('');
    setError(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-white text-center sm:text-left">
            Buscar Empleado
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
            <input
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Ingrese número de documento"
              className="flex-1 px-4 py-2 bg-dark-800 border border-dark-600 rounded-md text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button 
              type="submit" 
              variant="primary"
              className="w-full sm:w-auto"
            >
              Buscar
            </Button>
          </div>
          
          <p className="text-sm text-dark-400 text-center sm:text-left">
            Ingrese un documento para obtener las estadísticas de ese empleado.
          </p>
        </div>
      </form>

      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Spinner size="lg" />
          <p className="mt-4 text-primary">Buscando empleado...</p>
        </div>
      )}

      {user && (
        <div className="w-full max-w-md">
          <UserCard user={user} onBack={handleReset} />
        </div>
      )}

      {error && (
        <Toast 
          message={error} 
          type="error" 
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
};

export default UserSearch;
