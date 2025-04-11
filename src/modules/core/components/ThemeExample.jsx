import { useTheme } from '../context/ThemeContext';

const ThemeExample = () => {
  const { colors } = useTheme();
  
  return (
    <div className="p-6 bg-dark-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Ejemplo de Colores del Tema</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Colores primarios */}
        <div className="space-y-2">
          <h3 className="font-semibold">Colores Primarios</h3>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.primary.DEFAULT }}></div>
            <span>Primary (DEFAULT): {colors.primary.DEFAULT}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.primary[500] }}></div>
            <span>Primary 500: {colors.primary[500]}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.primary[600] }}></div>
            <span>Primary 600: {colors.primary[600]}</span>
          </div>
        </div>
        
        {/* Colores oscuros */}
        <div className="space-y-2">
          <h3 className="font-semibold">Colores Oscuros</h3>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.dark.DEFAULT }}></div>
            <span>Dark (DEFAULT): {colors.dark.DEFAULT}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.dark[800] }}></div>
            <span>Dark 800: {colors.dark[800]}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.dark[700] }}></div>
            <span>Dark 700: {colors.dark[700]}</span>
          </div>
        </div>
        
        {/* Colores de estado */}
        <div className="space-y-2">
          <h3 className="font-semibold">Colores de Estado</h3>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.success }}></div>
            <span>Success: {colors.success}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.warning }}></div>
            <span>Warning: {colors.warning}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.danger }}></div>
            <span>Danger: {colors.danger}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-gray-400">
          Estos colores están definidos en el ThemeContext y corresponden a los valores configurados en tailwind.config.js.
          Puedes acceder a ellos en cualquier componente usando el hook useTheme().
        </p>
      </div>
    </div>
  );
};

export default ThemeExample;
