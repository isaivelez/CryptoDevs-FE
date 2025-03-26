# Sistema de Control de Acceso Empresarial

Este proyecto es un sistema de control de ingresos y salidas de empleados y visitantes para empresas. Permite gestionar y monitorear el flujo de personas dentro de las instalaciones de manera eficiente y segura.

## Características Principales

- Registro de empleados y visitantes
- Control de entradas y salidas
- Búsqueda rápida por número de documento
- Interfaz moderna y responsiva
- Estadísticas de acceso por usuario

## Tecnologías Utilizadas

- React.js
- Tailwind CSS
- Axios
- Vite
- SASS

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Backend del sistema corriendo en localhost:8000

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd crypto-devs-fe
```

2. Instalar dependencias:

```bash
npm install
# o
yarn install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

El proyecto estará disponible en `http://localhost:62902/`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la versión de producción localmente

## Estructura del Proyecto

```
crypto-devs-fe/
├── src/
│   ├── components/     # Componentes React
│   ├── styles/        # Estilos SASS
│   ├── App.jsx        # Componente principal
│   └── main.jsx       # Punto de entrada
├── public/            # Archivos estáticos
└── package.json       # Dependencias y scripts
```
