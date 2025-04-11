import React from 'react';
import AttendanceChart from '../components/AttendanceChart.jsx';
import DepartureChart from '../components/DepartureChart.jsx';
import MonthlyAttendanceChart from '../components/MonthlyAttendanceChart.jsx';
import WeekdayAttendanceChart from '../components/WeekdayAttendanceChart.jsx';

const Reports = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Reportes de Asistencia</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">Puntualidad de Llegada</h2>
          <AttendanceChart />
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">Puntualidad de Salida</h2>
          <DepartureChart />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">Asistencia Mensual</h2>
          <MonthlyAttendanceChart />
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">Asistencia por Día de la Semana</h2>
          <WeekdayAttendanceChart />
        </div>
      </div>
    </div>
  );
};

export default Reports;
