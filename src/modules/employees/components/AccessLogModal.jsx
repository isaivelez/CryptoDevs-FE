import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaIdCard } from 'react-icons/fa';
import Modal from '../../core/design-system/Modal';
import Button from '../../core/design-system/Button';
import Spinner from '../../core/design-system/Spinner';

const AccessLogModal = ({ isOpen, onClose, accessType }) => {
  const [documentNumber, setDocumentNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDocumentChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setDocumentNumber(value);
      setError('');
    }
  };

  const validateDocument = () => {
    if (!documentNumber) {
      setError('El número de documento es requerido');
      return false;
    }
    
    if (!/^\d+$/.test(documentNumber)) {
      setError('El documento debe contener solo números');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateDocument()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, get the employee by document number
      const userResponse = await axios.get(`http://127.0.0.1:8000/users/${documentNumber}`);
      const userId = userResponse.data.id;
      
      // Get current date in YYYY-MM-DD format
      const today = new Date();
      const workdayDate = today.toISOString().split('T')[0];
      
      // Create access log
      const accessLogData = {
        person_type: "employee",
        person_id: userId,
        access_type: accessType === 'entry' ? 'entry' : 'exit',
        workday_date: workdayDate
      };
      
      await axios.post('http://127.0.0.1:8000/access-logs', accessLogData);
      
      toast.success(`Registro de ${accessType === 'entry' ? 'entrada' : 'salida'} exitoso`);
      setDocumentNumber('');
      onClose();
    } catch (error) {
      console.error('Error al registrar acceso:', error);
      if (error.response?.status === 404) {
        setError('Empleado no encontrado. Verifique el número de documento.');
      } else {
        setError(error.response?.data?.detail || 'Error al registrar acceso');
        toast.error(error.response?.data?.detail || 'Error al registrar acceso');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Registrar ${accessType === 'entry' ? 'Ingreso' : 'Salida'} de Empleado`}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Número de Documento
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaIdCard className="text-gray-400" />
            </div>
            <input
              type="text"
              value={documentNumber}
              onChange={handleDocumentChange}
              className="flex-1 px-4 py-2 pl-10 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full transition-colors"
              placeholder="Ingrese número de documento"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <Button 
            variant="secondary" 
            type="button" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" className="mr-2" />
                <span>Procesando...</span>
              </div>
            ) : (
              `Registrar ${accessType === 'entry' ? 'Ingreso' : 'Salida'}`
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AccessLogModal;
