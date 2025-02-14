import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AddTrip = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "", // New field
        carrierName: "",
        source: "",
        destination: "",
        startLandmark: "",
        endLandmark: "",
        date: "",
        vehicleType: "",
        capacity: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fetch User Details based on Email
    const fetchUserDetails = async (email) => {
        try {
            const response = await fetch("http://localhost:8080/api/users/getByEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }) // ✅ Wrap email inside an object
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "User not found");
            }

            const data = await response.json();
            setFormData((prevData) => ({
                ...prevData,
                carrierName: data.name, // ✅ Set carrier name
            }));
        } catch (err) {
            setError(err.message);
            setFormData((prevData) => ({ ...prevData, carrierName: "" }));
        }
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/trips/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Failed to add trip");

            console.log("Trip Data Stored:", formData);
            navigate("/carrier/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-lg leading-6 font-medium text-gray-900 mb-6">Add New Trip</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                    {error && <p className="text-red-500">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        handleChange(e);
                                        fetchUserDetails(e.target.value); // Fetch details on email change
                                    }}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            {/* Carrier Name (Auto-Filled) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Carrier Name</label>
                                <input
                                    type="text"
                                    name="carrierName"
                                    value={formData.carrierName}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                                    readOnly
                                />
                            </div>

                            {/* Other Input Fields */}
                            {["source", "destination", "startLandmark", "endLandmark", "date", "vehicleType", "capacity"].map((key) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </label>
                                    <input
                                        type={key === "date" ? "date" : "text"}
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/carrier-dashboard")}
                                className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
