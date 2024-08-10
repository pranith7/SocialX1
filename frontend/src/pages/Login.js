import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/style.css'; 

function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:4000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          password,
        }),
        credentials: 'include', // Include cookies with the request
      });

      const result = await response.json();
      console.log('Response from server:', result); // Debugging line

      if (result.statusCode === 200 && result.success === true) {
        setSuccess('Login successful!');
        localStorage.setItem('user', JSON.stringify(result.data.name));
        navigate('/', {replace: true});
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error); // Debugging line
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <>
      <meta charSet="UTF-8" />
      <link rel="stylesheet" href="/styles/style.css" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login</title>
      <div className="center-container">
        <div className="signin-form">
          <h1>Sign In</h1>
          <p>
            If you have not created an account yet, then please
            <a href="/register/"> sign up </a>
            first.
          </p>
          <form onSubmit={loginUser}>
            <div id="div_id_login" className="mb-3">
              <label htmlFor="id_login" className="form-label requiredField">
                Username
                <span className="asteriskField"> * </span>
              </label>
              <input
                type="text"
                name="login"
                placeholder="Username"
                autoComplete="username"
                maxLength={150}
                className="textinput form-control"
                required=""
                id="id_login"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div id="div_id_password" className="mb-3">
              <label htmlFor="id_password" className="form-label requiredField">
                Password
                <span className="asteriskField"> * </span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                className="passwordinput form-control"
                required=""
                id="id_password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div id="id_password_helptext" className="form-text">
                <a href="/password/reset/"> Forgot your password? </a>
              </div>
            </div>
            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  name="remember"
                  className="form-check-input"
                  id="id_remember"
                />
                <label htmlFor="id_remember" className="form-check-label">
                  {" "}
                  Remember Me{" "}
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Sign In
            </button>
          </form>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </div>
      </div>
    </>
  );
}

export default Login;