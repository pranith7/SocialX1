import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await axios.post('http://localhost:4000/api/v1/auth/logout', {}, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    console.log("User Logged out");
                    localStorage.removeItem('user');
                    navigate('/login', { replace: true });
                } else {
                    console.error("Logout failed:", response.data.message);
                }
            } catch (error) {
                console.error("Error logging out:", error);
            }
        };

        logout();
    }, [navigate]);

    return null;
};

export default Logout;