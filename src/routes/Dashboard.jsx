import { Routes, Route, Navigate } from 'react-router-dom';
import VisitorSearch from '../modules/visitors/components/VisitorSearch';
import { useAuth } from '../modules/auth/context/AuthContext';
import RegisterEmployee from '../modules/employees/pages/RegisterEmployee';
import ManageEmployees from '../modules/employees/pages/ManageEmployees';
import Employees from '../modules/employees/pages/Employees';
import Reports from '../modules/reports/pages/Reports.jsx';
import ReportTables from '../modules/reports/pages/ReportTables.jsx';
import QRCodeModule from '../modules/qr-scanner/QRCodeModule';
import QRGenerator from '../modules/qr-scanner/QRGenerator';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='flex flex-col items-center'>
      <Routes>
        <Route path='/empleados' element={<Employees />} />
        <Route path='/visitantes' element={<VisitorSearch />} />
        <Route path='/registrar-empleado' element={<RegisterEmployee />} />
        <Route path='/administrar-empleados' element={<ManageEmployees />} />
        <Route path='/reportes' element={<Reports />} />
        <Route path='/reportes/tablas' element={<ReportTables />} />
        <Route path='/qr-scanner' element={<QRCodeModule />} />
        <Route path='/qr-generator/:type/:id' element={<QRGenerator />} />
        <Route path='*' element={<Navigate to='/dashboard/empleados' replace />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
