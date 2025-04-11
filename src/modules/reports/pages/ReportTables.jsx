import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../core/design-system/Spinner';
import Button from '../../core/design-system/Button';

const ReportTables = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [accessLogs, setAccessLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros interactivos
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    value: ''
  });
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const filterType = queryParams.get('type') || ''; // 'onTime', 'late', 'early', etc.
  const filterCategory = queryParams.get('category') || ''; // 'attendance', 'departure', 'monthly', 'weekday'
  const filterValue = queryParams.get('value') || ''; // Month name, day name, etc.

  useEffect(() => {
    // Inicializar los filtros con los valores de la URL
    setFilters({
      category: filterCategory,
      type: filterType,
      value: filterValue
    });
    
    const fetchAccessLogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/access-logs/detailed?limit=1000');
        
        if (response.data && Array.isArray(response.data)) {
          console.log(`Total records fetched: ${response.data.length}`);
          setAccessLogs(response.data);
          
          // Apply filters
          applyFilters(response.data, filterCategory, filterType, filterValue);
        } else {
          setError('Formato de datos no válido');
        }
      } catch (err) {
        console.error('Error fetching access logs:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchAccessLogs();
  }, [filterType, filterCategory, filterValue]);

  const applyFilters = (logs, category, type, value) => {
    console.log(`Applying filters - Category: ${category}, Type: ${type}, Value: ${value}`);
    
    // Iniciar con todos los registros de empleados
    let filtered = logs.filter(log => log.person_type === 'employee');
    
    // Si no hay categoría seleccionada, mostrar todos los registros de empleados
    if (!category) {
      setFilteredLogs(filtered);
      return;
    }

    // Aplicar filtros por categoría
    if (category === 'attendance') {
      // Filtrar solo entradas
      filtered = filtered.filter(log => log.action_type === 'entry');
      
      // Si hay un valor específico seleccionado (onTime o late)
      if (value) {
        if (value === 'onTime') {
          filtered = filtered.filter(log => {
            if (!log.timestamp) return false;
            
            const utcDate = new Date(log.timestamp);
            if (isNaN(utcDate.getTime())) return false;
            
            const localDate = new Date(utcDate.getTime());
            
            const hours = localDate.getHours();
            const minutes = localDate.getMinutes();
            
            return hours < 8 || (hours === 8 && minutes === 0);
          });
        } else if (value === 'late') {
          filtered = filtered.filter(log => {
            if (!log.timestamp) return false;
            
            const utcDate = new Date(log.timestamp);
            if (isNaN(utcDate.getTime())) return false;
            
            const localDate = new Date(utcDate.getTime());
            
            const hours = localDate.getHours();
            const minutes = localDate.getMinutes();
            
            return hours > 8 || (hours === 8 && minutes > 0);
          });
        }
      }
    } else if (category === 'departure') {
      // Filtrar solo salidas
      filtered = filtered.filter(log => log.action_type === 'exit');
      
      // Si hay un valor específico seleccionado (early o onTime)
      if (value) {
        if (value === 'early') {
          filtered = filtered.filter(log => {
            if (!log.timestamp) return false;
            
            const utcDate = new Date(log.timestamp);
            if (isNaN(utcDate.getTime())) return false;
            
            const localDate = new Date(utcDate.getTime());
            
            const hours = localDate.getHours();
            return hours < 17;
          });
        } else if (value === 'onTime') {
          filtered = filtered.filter(log => {
            if (!log.timestamp) return false;
            
            const utcDate = new Date(log.timestamp);
            if (isNaN(utcDate.getTime())) return false;
            
            const localDate = new Date(utcDate.getTime());
            
            const hours = localDate.getHours();
            return hours >= 17;
          });
        }
      }
    } else if (category === 'monthly') {
      // Filtrar solo entradas
      filtered = filtered.filter(log => log.action_type === 'entry');
      
      // Filtrar por mes específico si se seleccionó
      if (type) {
        const monthNames = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        const monthIndex = monthNames.indexOf(type);
        if (monthIndex !== -1) {
          filtered = filtered.filter(log => {
            if (!log.timestamp) return false;
            
            const utcDate = new Date(log.timestamp);
            if (isNaN(utcDate.getTime())) return false;
            
            const localDate = new Date(utcDate.getTime());
            
            return localDate.getMonth() === monthIndex;
          });
        }
      }
      
      // Filtrar por estado (A tiempo/Tarde) si se seleccionó
      if (value) {
        if (value === 'onTime') {
          filtered = filtered.filter(log => {
            if (!log.timestamp) return false;
            
            const utcDate = new Date(log.timestamp);
            if (isNaN(utcDate.getTime())) return false;
            
            const localDate = new Date(utcDate.getTime());
            
            const hours = localDate.getHours();
            const minutes = localDate.getMinutes();
            
            return hours < 8 || (hours === 8 && minutes === 0);
          });
        } else if (value === 'late') {
          filtered = filtered.filter(log => {
            if (!log.timestamp) return false;
            
            const utcDate = new Date(log.timestamp);
            if (isNaN(utcDate.getTime())) return false;
            
            const localDate = new Date(utcDate.getTime());
            
            const hours = localDate.getHours();
            const minutes = localDate.getMinutes();
            
            return hours > 8 || (hours === 8 && minutes > 0);
          });
        }
      }
    } else if (category === 'weekday') {
      // Filtrar solo entradas
      filtered = filtered.filter(log => log.action_type === 'entry');
      
      // Filtrar por día de la semana si se seleccionó
      if (type) {
        const weekdayNames = [
          'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
        ];
        
        const weekdayIndex = weekdayNames.indexOf(type);
        if (weekdayIndex !== -1) {
          filtered = filtered.filter(log => {
            if (!log.timestamp) return false;
            
            const utcDate = new Date(log.timestamp);
            if (isNaN(utcDate.getTime())) return false;
            
            const localDate = new Date(utcDate.getTime());
            
            return localDate.getDay() === weekdayIndex;
          });
        }
      }
      
      // Filtrar por estado (A tiempo/Tarde) si se seleccionó
      if (value) {
        if (value === 'onTime') {
          filtered = filtered.filter(log => {
            if (!log.timestamp) return false;
            
            const utcDate = new Date(log.timestamp);
            if (isNaN(utcDate.getTime())) return false;
            
            const localDate = new Date(utcDate.getTime());
            
            const hours = localDate.getHours();
            const minutes = localDate.getMinutes();
            
            return hours < 8 || (hours === 8 && minutes === 0);
          });
        } else if (value === 'late') {
          filtered = filtered.filter(log => {
            if (!log.timestamp) return false;
            
            const utcDate = new Date(log.timestamp);
            if (isNaN(utcDate.getTime())) return false;
            
            const localDate = new Date(utcDate.getTime());
            
            const hours = localDate.getHours();
            const minutes = localDate.getMinutes();
            
            return hours > 8 || (hours === 8 && minutes > 0);
          });
        }
      }
    }

    console.log(`Filtered logs count: ${filtered.length}`);
    setFilteredLogs(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Convertir el timestamp UTC a objeto Date
    const utcDate = new Date(dateString);
    if (isNaN(utcDate.getTime())) return 'Fecha inválida';
    
    // Crear un objeto Date con la hora local
    const localDate = new Date(utcDate.getTime());
    
    return localDate.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Convertir el timestamp UTC a objeto Date
    const utcDate = new Date(dateString);
    if (isNaN(utcDate.getTime())) return 'Hora inválida';
    
    // Crear un objeto Date con la hora local
    const localDate = new Date(utcDate.getTime());
    
    return localDate.toLocaleString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const getFilterDescription = () => {
    let description = '';
    
    if (filters.category === 'attendance') {
      if (filters.value === 'onTime') {
        description = 'Registros de entrada a tiempo';
      } else if (filters.value === 'late') {
        description = 'Registros de entrada tarde';
      } else {
        description = 'Registros de entrada';
      }
    } else if (filters.category === 'departure') {
      if (filters.value === 'early') {
        description = 'Registros de salida temprana';
      } else if (filters.value === 'onTime') {
        description = 'Registros de salida a tiempo';
      } else {
        description = 'Registros de salida';
      }
    } else if (filters.category === 'monthly') {
      let monthDesc = filters.type ? `de ${filters.type}` : 'mensuales';
      
      if (filters.value === 'onTime') {
        description = `Registros ${monthDesc} a tiempo`;
      } else if (filters.value === 'late') {
        description = `Registros ${monthDesc} tarde`;
      } else {
        description = `Registros ${monthDesc}`;
      }
    } else if (filters.category === 'weekday') {
      let dayDesc = filters.type ? `de ${filters.type}` : 'por día de la semana';
      
      if (filters.value === 'onTime') {
        description = `Registros ${dayDesc} a tiempo`;
      } else if (filters.value === 'late') {
        description = `Registros ${dayDesc} tarde`;
      } else {
        description = `Registros ${dayDesc}`;
      }
    }
    
    return description || 'Todos los registros';
  };
  
  const getStatusLabel = (log) => {
    if (!log.timestamp) return 'N/A';
    
    // Convertir el timestamp UTC a objeto Date
    const utcDate = new Date(log.timestamp);
    if (isNaN(utcDate.getTime())) return 'N/A';
    
    // Crear un objeto Date con la hora local
    const localDate = new Date(utcDate.getTime());
    
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    
    if (log.action_type === 'entry') {
      if (hours < 8 || (hours === 8 && minutes === 0)) {
        return (
          <span className="px-2 py-1 bg-green-600 bg-opacity-20 text-green-500 rounded">
            A tiempo
          </span>
        );
      } else {
        return (
          <span className="px-2 py-1 bg-red-600 bg-opacity-20 text-red-500 rounded">
            Tarde
          </span>
        );
      }
    } else if (log.action_type === 'exit') {
      if (hours < 17) {
        return (
          <span className="px-2 py-1 bg-yellow-600 bg-opacity-20 text-yellow-500 rounded">
            Temprano
          </span>
        );
      } else {
        return (
          <span className="px-2 py-1 bg-green-600 bg-opacity-20 text-green-500 rounded">
            A tiempo
          </span>
        );
      }
    }
    
    return 'N/A';
  };
  
  const getActionTypeLabel = (actionType) => {
    switch (actionType) {
      case 'entry':
        return (
          <span className="px-2 py-1 bg-blue-600 bg-opacity-20 text-blue-500 rounded">
            Entrada
          </span>
        );
      case 'exit':
        return (
          <span className="px-2 py-1 bg-purple-600 bg-opacity-20 text-purple-500 rounded">
            Salida
          </span>
        );
      default:
        return actionType || 'N/A';
    }
  };
  
  const handleBackClick = () => {
    navigate('/dashboard/reportes');
  };
  
  // Manejadores para los filtros interactivos
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Actualizar el estado de los filtros
    const newFilters = {
      ...filters,
      [name]: value
    };
    
    // Si se cambia la categoría, reiniciar el tipo y el valor
    if (name === 'category') {
      newFilters.type = '';
      newFilters.value = '';
    }
    
    setFilters(newFilters);
    
    // Aplicar los nuevos filtros
    applyFilters(accessLogs, newFilters.category, newFilters.type, newFilters.value);
  };
  
  // Opciones para los selectores
  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    { value: 'attendance', label: 'Asistencia (Entradas)' },
    { value: 'departure', label: 'Salidas' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'weekday', label: 'Por día de la semana' }
  ];
  
  const getTypeOptions = () => {
    if (filters.category === 'attendance') {
      return [
        { value: '', label: 'Todos los tipos' }
      ];
    } else if (filters.category === 'departure') {
      return [
        { value: '', label: 'Todos los tipos' }
      ];
    } else if (filters.category === 'monthly') {
      return [
        { value: '', label: 'Todos los meses' },
        { value: 'Enero', label: 'Enero' },
        { value: 'Febrero', label: 'Febrero' },
        { value: 'Marzo', label: 'Marzo' },
        { value: 'Abril', label: 'Abril' },
        { value: 'Mayo', label: 'Mayo' },
        { value: 'Junio', label: 'Junio' },
        { value: 'Julio', label: 'Julio' },
        { value: 'Agosto', label: 'Agosto' },
        { value: 'Septiembre', label: 'Septiembre' },
        { value: 'Octubre', label: 'Octubre' },
        { value: 'Noviembre', label: 'Noviembre' },
        { value: 'Diciembre', label: 'Diciembre' }
      ];
    } else if (filters.category === 'weekday') {
      return [
        { value: '', label: 'Todos los días' },
        { value: 'Lunes', label: 'Lunes' },
        { value: 'Martes', label: 'Martes' },
        { value: 'Miércoles', label: 'Miércoles' },
        { value: 'Jueves', label: 'Jueves' },
        { value: 'Viernes', label: 'Viernes' },
        { value: 'Sábado', label: 'Sábado' },
        { value: 'Domingo', label: 'Domingo' }
      ];
    }
    
    return [{ value: '', label: 'Todos los tipos' }];
  };
  
  const getValueOptions = () => {
    if (filters.category === 'attendance') {
      return [
        { value: '', label: 'Todos los valores' },
        { value: 'onTime', label: 'A tiempo' },
        { value: 'late', label: 'Tarde' }
      ];
    } else if (filters.category === 'departure') {
      return [
        { value: '', label: 'Todos los valores' },
        { value: 'early', label: 'Temprano' },
        { value: 'onTime', label: 'A tiempo' }
      ];
    } else if (filters.category === 'monthly' || filters.category === 'weekday') {
      return [
        { value: '', label: 'Todos los valores' },
        { value: 'onTime', label: 'A tiempo' },
        { value: 'late', label: 'Tarde' }
      ];
    }
    
    return [{ value: '', label: 'Todos los valores' }];
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <Spinner size="lg" />
        <p className="text-primary">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-6">
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-dark-800 shadow-lg rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary border-b border-dark-600 pb-3">Tabla de Reportes</h2>
          <Button 
            onClick={handleBackClick}
            variant="primary"
            className="mt-4 sm:mt-0"
          >
            Volver a Gráficos
          </Button>
        </div>

        {/* Filtros interactivos */}
        <div className="bg-dark-700 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 bg-dark-600 border border-dark-500 rounded text-white"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {filters.category === 'monthly' ? 'Mes' : 
                 filters.category === 'weekday' ? 'Día' : 'Tipo'}
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full p-2 bg-dark-600 border border-dark-500 rounded text-white"
                disabled={!filters.category}
              >
                {getTypeOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Valor</label>
              <select
                name="value"
                value={filters.value}
                onChange={handleFilterChange}
                className="w-full p-2 bg-dark-600 border border-dark-500 rounded text-white"
                disabled={!filters.category}
              >
                {getValueOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Filtros aplicados */}
        <div className="bg-dark-700 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Filtros Aplicados</h3>
          <p className="text-gray-300">{getFilterDescription()}</p>
        </div>
        
        {/* Tabla de resultados */}
        <div className="mt-4">
          <p className="mb-4 text-gray-300">Total de registros encontrados: {filteredLogs.length}</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-600">
              <thead className="bg-dark-700">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th scope="col" className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Documento
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Hora
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-800 divide-y divide-dark-700">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => {
                    // Determinar el estado (A tiempo, Tarde, Temprano)
                    let status = 'N/A';
                    let statusClass = '';
                    
                    if (log.action_type === 'entry') {
                      if (!log.timestamp) {
                        status = 'N/A';
                      } else {
                        const utcDate = new Date(log.timestamp);
                        if (!isNaN(utcDate.getTime())) {
                          const localDate = new Date(utcDate.getTime());
                          const hours = localDate.getHours();
                          const minutes = localDate.getMinutes();
                          
                          if (hours < 8 || (hours === 8 && minutes === 0)) {
                            status = 'A tiempo';
                            statusClass = 'text-green-500';
                          } else {
                            status = 'Tarde';
                            statusClass = 'text-red-500';
                          }
                        }
                      }
                    } else if (log.action_type === 'exit') {
                      if (!log.timestamp) {
                        status = 'N/A';
                      } else {
                        const utcDate = new Date(log.timestamp);
                        if (!isNaN(utcDate.getTime())) {
                          const localDate = new Date(utcDate.getTime());
                          const hours = localDate.getHours();
                          
                          if (hours < 17) {
                            status = 'Temprano';
                            statusClass = 'text-yellow-500';
                          } else {
                            status = 'A tiempo';
                            statusClass = 'text-green-500';
                          }
                        }
                      }
                    }
                    
                    // Construir el nombre completo
                    const fullName = log.person_details ? 
                      `${log.person_details.first_name} ${log.person_details.last_name}` : 
                      `ID: ${log.person_id}`;
                    
                    const documentNumber = log.person_details ? 
                      log.person_details.document_number : 
                      'N/A';
                    
                    return (
                      <tr key={index} className="hover:bg-dark-700">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                          {index + 1}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                          {fullName}
                        </td>
                        <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                          {documentNumber}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                          {log.action_type === 'entry' ? 
                            <span className="px-2 py-1 bg-blue-600 bg-opacity-20 text-blue-500 rounded">Entrada</span> : 
                            <span className="px-2 py-1 bg-purple-600 bg-opacity-20 text-purple-500 rounded">Salida</span>
                          }
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                          {formatTime(log.timestamp)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 bg-opacity-20 rounded ${statusClass} ${
                            status === 'A tiempo' ? 'bg-green-600' : 
                            status === 'Tarde' ? 'bg-red-600' : 'bg-yellow-600'
                          }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 sm:px-6 py-4 text-center text-gray-400">
                      No se encontraron registros que coincidan con los filtros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTables;
