import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import './styles/main.scss'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
