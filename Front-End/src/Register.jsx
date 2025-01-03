import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "sender",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            password: formData.password,
        };

        try {
            const response = await fetch("http://localhost:8080/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                alert("User registered successfully");
                navigate("/login");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "Registration failed"}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering.");
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="sender">Sender</option>
                        <option value="carrier">Carrier</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn_primary">Register</button>
            </form>
            <a href="/login" className="link">Already have an account? Login here</a>
        </div>
    );
};

export default Register;
