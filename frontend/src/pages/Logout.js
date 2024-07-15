import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post('/api/logout', {}, {
                    withCredentials: true
                });
                localStorage.removeItem('user');
                navigate('/login');
            } catch (error) {
                console.error("Error logging out:", error);
            }
        };

        logout();
    }, [navigate]);
};

export default Logout;