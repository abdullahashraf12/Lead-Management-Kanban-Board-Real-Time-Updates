import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import UserLoginChecker from './Home.tsx'
import { BrowserRouter as Router, } from 'react-router-dom';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);
root.render(
  <Router> 
  <StrictMode>
    <UserLoginChecker />
  </StrictMode>,
  </Router>

)

export { root };