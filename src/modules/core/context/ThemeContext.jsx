import { createContext, useContext, useState } from 'react';

// Colores del tema definidos en tailwind.config.js
const themeColors = {
  primary: {
    DEFAULT: '#00DC82',
    50: '#E6FFF3',
    100: '#B3FFE0',
    200: '#80FFCD',
    300: '#4DFFBA',
    400: '#1AFFA7',
    500: '#00DC82',
    600: '#00A962',
    700: '#007642',
    800: '#004326',
    900: '#001006',
  },
  dark: {
    DEFAULT: '#0F1115',
    50: '#F8F9FA',
    100: '#E9ECEF',
    200: '#DEE2E6',
    300: '#CED4DA',
    400: '#ADB5BD',
    500: '#6C757D',
    600: '#495057',
    700: '#343A40',
    800: '#212529',
    900: '#0F1115',
  },
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#00DC82', // Mismo que primary.DEFAULT
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    colors: themeColors,
    isDark: true, // Por defecto tema oscuro
  });

  // Función para cambiar entre tema claro y oscuro si se necesita en el futuro
  const toggleDarkMode = () => {
    setTheme(prevTheme => ({
      ...prevTheme,
      isDark: !prevTheme.isDark,
    }));
  };

  const value = {
    ...theme,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
