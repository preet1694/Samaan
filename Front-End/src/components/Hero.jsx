import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Hero = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/register');
    };

    return (
        <section className="hero">
            <div className="container">
                <h2>Effortless Delivery</h2>
                <p className="subtitle">Connecting Senders and Travelers to Minimize Delivery Time and Cost</p>
                <button className="btn-primary btn-large" onClick={handleGetStarted}>
                    Get Started
                </button>
            </div>
        </section>
    );
};

export default Hero;
