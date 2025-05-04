// RegisterEmployee Component
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaUser, FaIdCard, FaEnvelope, FaLock, FaBriefcase, FaDownload, FaQrcode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

const RegisterEmployee = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    watch
  } = useForm();
  
  // Verificar si el usuario actual es administrador
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Aquí deberías implementar la lógica para verificar si el usuario actual es administrador
        // Por ahora, asumimos que el usuario es administrador
      } catch (error) {
        console.error('Error al verificar estado de administrador:', error);
        navigate('/dashboard');
      }
    };
    
    checkAdminStatus();
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Determinar el tipo de usuario basado en la selección y si es admin
      let userType = data.userType; // 'employee' o 'standard'
      
      // Si marcó la casilla de admin, sobreescribir el tipo
      if (isAdmin) {
        userType = 'admin';
      }
      
      const userData = {
        document_number: data.documentNumber,
        first_name: data.firstName,
        last_name: data.lastName,
        position: data.userType === 'employee' ? 'Empleado' : 'Visitante',
        email: data.email,
        is_admin: isAdmin,
        user_type: userType,  // Añadimos explícitamente el tipo de usuario
        password: isAdmin ? data.password : undefined
      };

      console.log('Enviando datos de usuario:', userData);

      // Usar el nuevo endpoint para registro de usuarios por administradores
      const response = await axios.post('http://127.0.0.1:8000/users/admin/register', userData);
      
      toast.success('Usuario registrado exitosamente y se ha enviado un correo de notificación');
      
      // Mostrar el código QR generado
      if (response.data && response.data.qr_code_id) {
        setQrCodeData({
          qrCodeId: response.data.qr_code_id,
          user: response.data.user
        });
        setShowQrCode(true);
      }
      
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      toast.error(error.response?.data?.detail || 'Error al registrar usuario');
      setIsLoading(false);
    }
  };
  
  const handleNewRegistration = () => {
    setShowQrCode(false);
    setQrCodeData(null);
    reset();
    setIsAdmin(false);
    setIsLoading(false);
  };
  
  const downloadQrCode = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-code-${qrCodeData.user.document_number}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-dark-800 shadow-lg rounded-lg w-full max-w-4xl mx-auto overflow-hidden">
        <ToastContainer position="top-right" theme="dark" />
        
        <div className="flex flex-col p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6 text-primary border-b border-dark-600 pb-3">Registro de Empleado</h2>
          
          {!showQrCode ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    autoComplete="off"
                    {...register('firstName', { 
                      required: 'El nombre es requerido',
                      pattern: {
                        value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
                        message: 'Solo se permiten letras'
                      }
                    })}
                    className="flex-1 px-4 py-2 pl-10 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full transition-colors"
                    placeholder="Nombre"
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">Apellido</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    autoComplete="off"
                    {...register('lastName', { 
                      required: 'El apellido es requerido',
                      pattern: {
                        value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
                        message: 'Solo se permiten letras'
                      }
                    })}
                    className="flex-1 px-4 py-2 pl-10 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full transition-colors"
                    placeholder="Apellido"
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Número de Documento</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIdCard className="text-gray-400" />
                </div>
                <input
                  type="text"
                  autoComplete="off"
                  {...register('documentNumber', { 
                    required: 'El número de documento es requerido',
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Solo se permiten números'
                    }
                  })}
                  className="flex-1 px-4 py-2 pl-10 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full transition-colors"
                  placeholder="Número de Documento"
                />
              </div>
              {errors.documentNumber && <p className="text-red-500 text-xs mt-1">{errors.documentNumber.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  autoComplete="off"
                  {...register('email', { 
                    required: 'El correo electrónico es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Dirección de correo electrónico inválida'
                    }
                  })}
                  className="flex-1 px-4 py-2 pl-10 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full transition-colors"
                  placeholder="Correo Electrónico"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBriefcase className="text-gray-400" />
                </div>
                <select
                  {...register('userType', { 
                    required: 'El tipo de usuario es requerido'
                  })}
                  className="flex-1 px-4 py-2 pl-10 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full transition-colors"
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="employee">Empleado</option>
                  <option value="standard">Visitante</option>
                </select>
              </div>
              {errors.userType && <p className="text-red-500 text-xs mt-1">{errors.userType.message}</p>}
            </div>

            <div className="flex items-center bg-dark-700 p-3 rounded-md border border-dark-600">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-700 rounded"
              />
              <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-300">
                Es Administrador
              </label>
            </div>

            <div className={`transition-all duration-300 ${isAdmin ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
              {isAdmin && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      autoComplete="new-password"
                      {...register('password', { 
                        required: isAdmin ? 'La contraseña es requerida para administradores' : false,
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
                          message: 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
                        }
                      })}
                      className="flex-1 px-4 py-2 pl-10 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full transition-colors"
                      placeholder="Contraseña"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  <p className="text-gray-400 text-xs mt-1">
                    La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 shadow-md"
              >
                {isLoading ? 'Registrando...' : 'Registrar Empleado'}
              </button>
            </div>
          </form>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-white p-4 rounded-lg">
                <QRCode
                  id="qr-code"
                  value={`http://127.0.0.1:8000/qr-codes/image/${qrCodeData?.qrCodeId}`}
                  size={200}
                  level="H"
                />
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-primary mb-2">¡Empleado registrado exitosamente!</h3>
                <p className="text-gray-300 mb-4">Se ha generado el código QR para {qrCodeData?.user.first_name} {qrCodeData?.user.last_name}</p>
                
                <div className="bg-dark-700 p-4 rounded-md border border-dark-600 mb-4 text-left">
                  <p className="mb-2"><span className="font-semibold">Documento:</span> {qrCodeData?.user.document_number}</p>
                  <p className="mb-2"><span className="font-semibold">Nombre:</span> {qrCodeData?.user.first_name} {qrCodeData?.user.last_name}</p>
                  <p className="mb-2"><span className="font-semibold">Correo:</span> {qrCodeData?.user.email}</p>
                  <p><span className="font-semibold">Tipo:</span> {qrCodeData?.user.user_type === 'admin' ? 'Administrador' : 'Empleado'}</p>
                </div>
                
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={downloadQrCode}
                    className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 shadow-md"
                  >
                    <FaDownload className="mr-2" /> Descargar QR
                  </button>
                  
                  <button
                    onClick={handleNewRegistration}
                    className="flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition duration-300 shadow-md"
                  >
                    <FaUser className="mr-2" /> Nuevo Registro
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployee;
