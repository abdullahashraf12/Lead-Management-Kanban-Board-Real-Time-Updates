import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LoginApp from './LoginApp.tsx'
import { BrowserRouter as Router, } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <Router> 

  <StrictMode>
    <LoginApp />
  </StrictMode>,
  </Router>
)
