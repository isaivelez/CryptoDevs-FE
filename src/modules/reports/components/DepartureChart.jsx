import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../core/context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const DepartureChart = () => {
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { colors } = useTheme();

  useEffect(() => {
    const fetchAccessLogs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/access-logs/detailed?limit=1000');
        if (response.data && Array.isArray(response.data)) {
          setAccessLogs(response.data);
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
  }, []);

  // Filter only employee exit logs
  const exitLogs = accessLogs.filter(log => 
    log.person_type === 'employee' && log.action_type === 'exit'
  );

  // Count early vs on-time departures
  const countDepartures = () => {
    let early = 0;
    let onTime = 0;

    exitLogs.forEach(log => {
      if (!log.timestamp) return;
      
      // Convertir el timestamp UTC a objeto Date
      const utcDate = new Date(log.timestamp);
      if (isNaN(utcDate.getTime())) return;
      
      // Crear un objeto Date con la hora local
      const localDate = new Date(utcDate.getTime());
      
      // Obtener la hora local
      const hours = localDate.getHours();
      
      // Verificar si la salida es temprana (antes de las 5:00 PM)
      if (hours < 17) {
        early++;
      } else {
        onTime++;
      }
    });

    return { early, onTime };
  };

  const { early, onTime } = countDepartures();

  // Theme colors from ThemeContext
  const warningColor = colors.danger;
  const successColor = colors.success;

  const data = {
    labels: ['Temprano', 'A Tiempo'],
    datasets: [
      {
        data: [early, onTime],
        backgroundColor: [
          `${warningColor}CC`,
          `${successColor}CC`,
        ],
        borderColor: [
          warningColor,
          successColor,
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Salidas',
        color: 'white',
        font: {
          size: 18
        }
      }
    },
  };

  const handleClick = (type) => {
    navigate(`/dashboard/reportes/tablas?category=departure&value=${type}`);
  };

  if (loading) {
    return <div className="text-center text-white">Cargando datos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md">
        <Pie data={data} options={options} />
      </div>
      <div className="mt-6 text-center text-white">
        <p>Total de registros de salida: {exitLogs.length}</p>
        <div className="flex justify-center mt-4 gap-4 w-full">
          <button 
            onClick={() => handleClick('early')}
            className="flex-1 py-2 bg-yellow-600 bg-opacity-20 border border-yellow-500 rounded hover:bg-opacity-30 transition max-w-xs"
          >
            Temprano: {early}
          </button>
          <button 
            onClick={() => handleClick('onTime')}
            className="flex-1 py-2 bg-primary bg-opacity-20 border border-primary rounded hover:bg-opacity-30 transition max-w-xs"
          >
            A tiempo: {onTime}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartureChart;
