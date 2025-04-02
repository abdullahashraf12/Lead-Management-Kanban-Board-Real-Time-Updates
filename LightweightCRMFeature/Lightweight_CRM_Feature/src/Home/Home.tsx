import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { WebSocketProvider } from '../context/WebSocketContext';
import FormPage from '../pages/FormPage';
import KanbanPage from '../pages/KanbanPage';
import '../App.css';
import Cookies from 'js-cookie';

const App: React.FC = () => {
  const [LoggedIn, setLoggedIn] = useState<string | undefined>(undefined); // Initial state as undefined to handle loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("http://localhost/api/get-csrf-token/", {
          credentials: "include", // Ensure cookies are sent
        });

        if (!response.ok) throw new Error("Failed to fetch CSRF token");

        const data = await response.json();
        console.log("CSRF Token:", data.csrfToken); // Debugging

        if (data.csrfToken) {
          const responseCheck = await fetch("http://localhost/api/checkUserLogin/", {
            credentials: "include",
          });

          if (!responseCheck.ok) throw new Error("Failed to check user login");

          const checkData = await responseCheck.json(); // Extract JSON response
          console.log("User login status:", checkData); // Debugging

          if (checkData.status === true) {
            Cookies.set('LoggedIn', "true");
            setLoggedIn("true");
            navigate('/', { replace: true });
          } else {
            navigate('/login', { replace: true });
            window.location.reload();
          }
        }
      } catch (error) {
        console.error("Error:", error);
        navigate('/login', { replace: true });
        window.location.reload();
      }
    };

    // Only check login status if not already set (when page loads)
    if (LoggedIn === undefined) {
      fetchCsrfToken();
    }

  }, [LoggedIn, navigate]);

  if (LoggedIn === undefined) {
    return null; // Return nothing while checking the login status
  }

  if (LoggedIn === "true") {
    return (
      <WebSocketProvider>
        <Routes>
          <Route path="/" element={<KanbanPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/form/:id" element={<FormPage />} />
        </Routes>
      </WebSocketProvider>
    );
  }

  // If not logged in, redirect to login page or show login-related UI
  return null; // You could also return a loading or login component here
};

export default App;
