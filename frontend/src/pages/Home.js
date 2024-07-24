import React from "react";
import './styles/home.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    }
    return (
        <>
            <header>
                <div className="logo">
                    <h1>SocialX1</h1>
                </div>
                <nav>
                    <input type="text" placeholder="Search" />
                    <button className="icon-button">
                        <i className="fas fa-search" />
                    </button>
                    <button className="green-button">Create Post</button>
                    <button className="gray-button" onClick={handleLogout}>Sign Out</button>
                </nav>
            </header>
            <main>
                <h2>
                    Hello <span className="username">user</span>, your feed is empty.
                </h2>
                <p>
                    Your feed displays the latest posts from the people you follow. If you
                    don't have any friends to follow that's okay; you can use the “Search”
                    feature in the top menu bar to find content written by people with similar
                    interests and then follow them.
                </p>
            </main>
            {/* <footer>
                <p>Copyright © 2019 OurApp. All rights reserved.</p>
            </footer> */}
        </>
    )
}

export default Home;