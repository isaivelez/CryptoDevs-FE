import { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import Spinner from './Spinner';
import Toast from './Toast';
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
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUser(null);
    setDocumentNumber('');
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
        <p className="mt-4 text-primary">Buscando empleado...</p>
      </div>
    );
  }

  if (user) {
    return <UserCard user={user} onBack={handleReset} />;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-white">Buscar empleado</h2>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Enter document number"
              className="flex-1 px-4 py-2 bg-dark-800 border border-dark-600 rounded-md text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button type="submit" variant="primary">
              Buscar
            </Button>
          </div>
          
          <p className="text-sm text-dark-400">
            Ingresa un documento para obtener las estadisticas de ese empleado.
          </p>
        </div>
      </form>

      {error && (
        <Toast 
          message={error} 
          type="error" 
          onClose={() => setError(null)}
        />
      )}
    </>
  );
};

export default UserSearch;
