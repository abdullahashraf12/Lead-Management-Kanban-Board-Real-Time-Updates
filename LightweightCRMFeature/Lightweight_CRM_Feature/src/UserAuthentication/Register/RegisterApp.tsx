import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function RegisterApp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("account", email);
    formData.append("id_username", username);
    formData.append("id_password1", password1);
    formData.append("id_password2", password2);

    try {
      const response = await fetch("http://localhost/api/register_post/", {
        method: "POST",
        body: formData,
        credentials: "include", // Ensures session cookies are sent
        headers: {
          "X-CSRFToken": csrfToken, // Append CSRF token in headers
        },
      });

      const result = await response.json();
      if (response.ok &&result.status=="success") {
        navigate('/login', { replace: true });
        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <>
      <h2>Register</h2>

      <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* CSRF Token is handled in headers, no need for a hidden input field */}

        <div className="form-group">
          <label htmlFor="account">Email:</label>
          <input
            type="email"
            id="account"
            name="email" // Make sure this is named "email" to match what the browser expects
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>


        <div className="form-group">
          <label htmlFor="id_username">Username:</label>
          <input
            type="text"
            id="id_username"
            name="id_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="id_password1">Password:</label>
          <input
            type="password"
            id="id_password1"
            name="id_password1"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="id_password2">Confirm Password:</label>
          <input
            type="password"
            id="id_password2"
            name="id_password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account?{" "}
        <a href="/login" style={{ color: "#007bff", textDecoration: "none" }}>
          Login here
        </a>
      </p>
    </>
  );
}

export default RegisterApp;
