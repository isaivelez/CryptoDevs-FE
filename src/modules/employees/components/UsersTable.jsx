import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../core/design-system/Button';
import Spinner from '../../core/design-system/Spinner';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <Spinner size="lg" />
        <p className="text-primary">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
        <Button onClick={fetchUsers} variant="secondary" className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Lista de Usuarios</h2>
        <Button variant="primary" size="sm">
          Exportar
        </Button>
      </div>

      <div className="bg-dark-800 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-600">
            <thead className="bg-dark-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Correo
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-dark-800 divide-y divide-dark-600">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-dark-700">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    {user.document_number}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm">
                    {user.email}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm">
                    {user.user_type}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
