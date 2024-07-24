import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const AuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = !!localStorage.getItem('user');
        if(isLoggedIn){
            navigate('/');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return null; // This component does not render anythng
};

export default AuthRedirect;