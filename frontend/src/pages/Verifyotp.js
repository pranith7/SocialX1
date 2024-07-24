import React, { useEffect } from "react";
import './styles/verifyotp.css';
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleFormSubmit = async (e) => {
            e.preventDefault();
            const email = e.target.elements.email.value;
            const otp = e.target.elements.otp.value;
            const response = await fetch(`http://localhost:4000/api/v1/auth/verifyotp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                navigate('/login');
            }
        };

        const verifyOTPForm = document.getElementById('verifyOTPForm');
        if (verifyOTPForm) {
            verifyOTPForm.addEventListener('submit', handleFormSubmit);
        }

        return () => {
            if (verifyOTPForm) {
                verifyOTPForm.removeEventListener('submit', handleFormSubmit);
            }
        };
    }, [navigate]);

    return (
        <div className="center-container">
            <form id="verifyOTPForm" className="form-container">
                <h1>Verify OTP</h1>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required className="form-input" />
                </div>
                <div className="form-group">
                    <label htmlFor="otp">OTP:</label>
                    <input type="text" id="otp" name="otp" required className="form-input" />
                </div>
                <button type="submit" className="submit-button">Verify OTP</button>
            </form>
        </div>
    );
}

export default VerifyOtp;