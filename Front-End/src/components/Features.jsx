import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Features = () => {
    return (
        <section id="features" className="section">
            <div className="feat">
                <h2>Features</h2>
                <ul className="features-list">
                    <li>Cost-effective deliveries.</li>
                    <li>Real-time package tracking.</li>
                    <li>Secure and verified connections.</li>
                    <li>Eco-friendly logistics.</li>
                </ul>
            </div>
        </section>
    );
};

export default Features;
