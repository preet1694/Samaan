import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="section">
            <div className="container">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <h3>1. Register</h3>
                        <p>Sign up as a traveler or sender.</p>
                    </div>
                    <div className="step">
                        <h3>2. Connect</h3>
                        <p>Find a traveler or sender that matches your needs.</p>
                    </div>
                    <div className="step">
                        <h3>3. Deliver</h3>
                        <p>Ensure fast and secure delivery to the destination.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
