import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CompList from './assets/components/CompList.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CompList/>
  </StrictMode>,
)
