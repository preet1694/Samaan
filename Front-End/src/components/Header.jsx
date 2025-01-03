import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <h1 className="logo">Samaan</h1>
                <nav className="nav">
                    <a href="#how-it-works" className="nav-link">How It Works</a>
                    <a href="#features" className="nav-link">Features</a>
                    {/* <a href="/send-package">Send a Package</a> */}
                    <a href="#contact" className="nav-link">Contact</a>
                    <button className="btn-primary">Sign Up</button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
