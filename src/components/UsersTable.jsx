import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './Button';
import Spinner from './Spinner';

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
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <Spinner size="lg" />
        <div className="text-primary font-medium">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 min-h-[400px] justify-center">
        <div className="text-red-500">{error}</div>
        <Button variant="primary" onClick={fetchUsers}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-dark-800 rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-dark-700">
        <thead className="bg-dark-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-dark-800 divide-y divide-dark-700">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-dark-700 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {user.first_name} {user.last_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
