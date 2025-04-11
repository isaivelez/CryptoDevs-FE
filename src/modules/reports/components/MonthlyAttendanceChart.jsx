import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../core/context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyAttendanceChart = () => {
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

  // Filter only employee entry logs
  const entryLogs = accessLogs.filter(log => 
    log.person_type === 'employee' && log.action_type === 'entry'
  );

  // Theme colors from ThemeContext
  const successColor = colors.success;
  const dangerColor = colors.danger;

  // Process data to count on-time vs late arrivals by month
  const processMonthlyData = () => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    // Initialize data structure for each month
    const monthlyData = monthNames.map(name => ({
      name,
      onTime: 0,
      late: 0
    }));
    
    entryLogs.forEach(log => {
      // Check if timestamp exists and is a valid date string
      if (!log.timestamp) return;
      
      // Convertir el timestamp UTC a objeto Date
      const utcDate = new Date(log.timestamp);
      if (isNaN(utcDate.getTime())) return;
      
      // Crear un objeto Date con la hora local
      const localDate = new Date(utcDate.getTime());
      
      // Get the month (0-11)
      const month = localDate.getMonth();
      
      // Get hours and minutes to determine if on time or late
      const hours = localDate.getHours();
      const minutes = localDate.getMinutes();
      
      // Check if arrival is on time (before or at 8:00 AM)
      if (hours < 8 || (hours === 8 && minutes === 0)) {
        monthlyData[month].onTime++;
      } else {
        monthlyData[month].late++;
      }
    });
    
    // Only include months with data
    return monthlyData.filter(month => month.onTime > 0 || month.late > 0);
  };

  const monthlyData = processMonthlyData();
  
  // Prepare data for Chart.js
  const labels = monthlyData.map(month => month.name);
  const onTimeData = monthlyData.map(month => month.onTime);
  const lateData = monthlyData.map(month => month.late);

  const data = {
    labels,
    datasets: [
      {
        label: 'A Tiempo',
        data: onTimeData,
        backgroundColor: `${successColor}CC`,
        borderColor: successColor,
        borderWidth: 1,
      },
      {
        label: 'Tarde',
        data: lateData,
        backgroundColor: `${dangerColor}CC`,
        borderColor: dangerColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white',
          precision: 0,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Asistencia Mensual',
        color: 'white',
        font: {
          size: 16
        }
      }
    },
  };

  // Handle click on month to navigate to tables view
  const handleMonthClick = (month, type) => {
    navigate(`/dashboard/reportes/tablas?category=monthly&type=${month}&value=${type}`);
  };

  // Handle click on total statistics
  const handleTotalClick = (type) => {
    navigate(`/dashboard/reportes/tablas?category=monthly&value=${type}`);
  };

  if (loading) {
    return <div className="text-center text-white">Cargando datos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <Bar data={data} options={options} />
        <div className="mt-6 text-center text-white">
          <p>Total de registros de entrada: {entryLogs.length}</p>
          <div className="flex justify-center mt-4 gap-4 w-full">
            <button 
              onClick={() => handleTotalClick('onTime')}
              className="flex-1 py-2 bg-primary bg-opacity-20 border border-primary rounded hover:bg-opacity-30 transition max-w-xs"
            >
              A tiempo: {onTimeData.reduce((a, b) => a + b, 0)}
            </button>
            <button 
              onClick={() => handleTotalClick('late')}
              className="flex-1 py-2 bg-red-600 bg-opacity-20 border border-red-600 rounded hover:bg-opacity-30 transition max-w-xs"
            >
              Tarde: {lateData.reduce((a, b) => a + b, 0)}
            </button>
          </div>
          
          {/* Month details */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {monthlyData.map((month, index) => (
              <div key={index} className="p-3 bg-dark-800 rounded">
                <h3 className="font-semibold">{month.name}</h3>
                <div className="flex flex-col sm:flex-row justify-center mt-2 gap-2">
                  <button 
                    onClick={() => handleMonthClick(month.name, 'onTime')}
                    className="flex-1 py-1 bg-primary bg-opacity-20 border border-primary rounded hover:bg-opacity-30 transition"
                  >
                    A tiempo: {month.onTime}
                  </button>
                  <button 
                    onClick={() => handleMonthClick(month.name, 'late')}
                    className="flex-1 py-1 bg-red-600 bg-opacity-20 border border-red-600 rounded hover:bg-opacity-30 transition"
                  >
                    Tarde: {month.late}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAttendanceChart;
