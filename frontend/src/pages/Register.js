import React, { useState } from 'react';
import './styles/style.css'; // Ensure this path is correct based on your project structure

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function registerUser(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful!');
        console.log(data);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <div className="center-container">
      <div className="signup-form">
        <h1 className="mb-3">Sign Up</h1>
        <p>If you have not created an account yet, then please <a href="/login/">sign in</a>.</p>
        <form onSubmit={registerUser} className="my-4">
          <div className="form-group mb-3">
            <label htmlFor="id_username" className="form-label">Username *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Username"
              autoComplete="username"
              minLength="1"
              maxLength="150"
              required
              id="id_username"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="id_email" className="form-label">Email (optional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control"
              placeholder="Email address"
              autoComplete="email"
              maxLength="320"
              id="id_email"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="id_password1" className="form-label">Password *</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
              placeholder="Password"
              autoComplete="new-password"
              required
              aria-describedby="id_password1_helptext"
              id="id_password1"
            />
            <span className="form-text" id="id_password1_helptext">
              * Your password must contain at least 8 characters.
            </span>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="id_password2" className="form-label">Password (again) *</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              className="form-control"
              placeholder="Password (again)"
              autoComplete="new-password"
              required
              id="id_password2"
            />
          </div>
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </div>
    </div>
  );
}

export default Register;
