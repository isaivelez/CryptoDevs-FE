// ManageEmployees Component
import React, { useState, useEffect } from 'react';
import UsersTable from '../components/UsersTable';
import { useLocation } from 'react-router-dom';

const ManageEmployees = () => {
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  useEffect(() => {
    // Check if we're coming from the registration page
    const isFromRegistration = location.state?.fromRegistration || false;
    
    if (isFromRegistration) {
      setShowSuccessMessage(true);
      
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="w-full">
      {showSuccessMessage && (
        <div className="bg-green-600 text-white p-4 mb-6 rounded-md shadow-md">
          Empleado registrado exitosamente. Ahora puedes ver todos los empleados en la tabla.
        </div>
      )}
      
      <div className="bg-dark-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary border-b border-dark-600 pb-3">Administrar Empleados</h2>
        <UsersTable />
      </div>
    </div>
  );
};

export default ManageEmployees;
