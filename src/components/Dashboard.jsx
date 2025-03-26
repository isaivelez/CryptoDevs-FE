import { Routes, Route, Navigate } from 'react-router-dom';
import UsersTable from './UsersTable';
import UserSearch from './UserSearch';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex justify-center">
      <Routes>
        <Route path="/" element={<UserSearch />} />
        <Route path="/users" element={<UsersTable />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
