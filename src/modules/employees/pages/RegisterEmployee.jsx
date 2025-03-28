// RegisterEmployee Component
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaUser, FaIdCard, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RegisterEmployee = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      const userData = {
        first_name: data.firstName,
        last_name: data.lastName,
        document_number: data.documentNumber,
        email: data.email,
        user_type: isAdmin ? 'admin' : 'standard',
        image_hash: 'default_image_hash_12345',
        password: isAdmin ? data.password : undefined
      };

      const response = await axios.post('http://127.0.0.1:8000/users', userData);
      
      toast.success('Empleado registrado exitosamente');
      reset();
      setIsAdmin(false);
      
      // Redirect to ManageEmployees after successful registration
      setTimeout(() => {
        navigate('/dashboard/administrar-empleados', { 
          state: { fromRegistration: true }
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error al registrar empleado:', error);
      toast.error(error.response?.data?.detail || 'Error al registrar empleado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-dark-800 shadow-lg rounded-lg w-full max-w-4xl mx-auto overflow-hidden">
        <ToastContainer position="top-right" theme="dark" />
        
        <div className="flex flex-col p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6 text-primary border-b border-dark-600 pb-3">Registro de Empleado</h2>
          
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
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployee;
