import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Footer = () => {
    return (
        <footer id="contact" className="footer">
            <div className="container">
                <p>&copy; 2024 Samaan. All Rights Reserved.</p>
                <p>Contact us at <a href="mailto:support@samaan.com">support@samaan.com</a></p>
            </div>
        </footer>
    );
};

export default Footer;
