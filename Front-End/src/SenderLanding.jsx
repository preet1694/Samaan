import React from "react";
import "../senderLanding.css";
import { Link } from "react-router-dom";

const SenderLanding = () => {
  return (
    <section className="sender-landing">
      <div className="container">
        <h1 className="welcome-message">Welcome, Sender!</h1>
        <div className="dashboard-cards">
          <Link to="/send-package" className="card">
            <h2>Send a Package</h2>
            <p>Create a new delivery request.</p>
          </Link>
          <Link to="/view-packages" className="card">
            <h2>View Packages</h2>
            <p>Check your sent packages and their statuses.</p>
          </Link>
          <Link to="/profile" className="card">
            <h2>Profile</h2>
            <p>Manage your profile information and settings.</p>
          </Link>
          <Link to="/help" className="card">
            <h2>Help Center</h2>
            <p>Get assistance or read FAQs.</p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SenderLanding;
