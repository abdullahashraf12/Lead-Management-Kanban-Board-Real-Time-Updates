import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RegisterApp from './RegisterApp.tsx'
import { BrowserRouter as Router, } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <Router> 

  <StrictMode>
    <RegisterApp />
  </StrictMode>,
  </Router>
)
