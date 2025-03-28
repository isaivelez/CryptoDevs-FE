import React, { useState } from 'react';
import UserSearch from '../components/UserSearch';
import ClickableCard from '../../core/design-system/ClickableCard';
import AccessLogModal from '../components/AccessLogModal';
import { HiOutlineLogin, HiOutlineLogout, HiOutlineUserAdd, HiOutlineUsers } from 'react-icons/hi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Employees = () => {
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  return (
    <div>
      <ToastContainer position="top-right" theme="dark" />
      <UserSearch />
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 px-4'>
        <ClickableCard 
          onClick={() => setShowEntryModal(true)}
          description="Registrar fecha y hora de ingreso a la empresa"
          icon={HiOutlineLogin}
        >
          Registrar ingreso
        </ClickableCard>
        <ClickableCard 
          onClick={() => setShowExitModal(true)}
          description="Registrar fecha y hora de salida de la empresa"
          icon={HiOutlineLogout}
        >
          Registrar salida
        </ClickableCard>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 px-4'>
        <ClickableCard 
          redirectTo="/dashboard/registrar-empleado" 
          description="Registrar nuevo empleado"
          icon={HiOutlineUserAdd}
        >
          Registrar empleado
        </ClickableCard>
        <ClickableCard 
          redirectTo="/dashboard/administrar-empleados" 
          description="Ver lista de empleados, para modificaciones y eliminaciones"
          icon={HiOutlineUsers}
        >
          Administrar empleados
        </ClickableCard>
      </div>

      {/* Entry Modal */}
      <AccessLogModal 
        isOpen={showEntryModal}
        onClose={() => setShowEntryModal(false)}
        accessType="entry"
      />

      {/* Exit Modal */}
      <AccessLogModal 
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        accessType="exit"
      />
    </div>
  );
};

export default Employees;
