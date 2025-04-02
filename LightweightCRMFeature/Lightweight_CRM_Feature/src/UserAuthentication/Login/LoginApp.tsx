import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginApp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  // Fetch CSRF token when the component mounts
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("http://localhost/api/get-csrf-token/", {
          credentials: "include", // Ensure cookies are sent
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, []);

  
 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("account", email);
    formData.append("id_password", password);
  
    try {
      const response = await fetch("http://localhost/api/login_post/", {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": csrfToken, // Append CSRF token in headers
        },
        credentials: "include", // Ensure cookies are sent
      });
  
      const result = await response.json();
  
      if (result.status === "success") {
        // navigate('/', { replace: true });
        window.location.href = 'http://localhost:5173/'; 
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  
  return (
    <>
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* CSRF Token is now handled in headers, so no need for a hidden input field */}
        
        <div className="form-group">
          <label htmlFor="account">Email:</label>
          <input
            type="email"
            id="account"
            name="account"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="id_password">Password:</label>
          <input
            type="password"
            id="id_password"
            name="id_password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account?{" "}
        <a href="/register" style={{ color: "#007bff", textDecoration: "none" }}>
          Register here
        </a>
      </p>
    </>
  );
}

export default LoginApp;
