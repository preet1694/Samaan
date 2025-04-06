import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AddTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    carrierName: "",
    source: "",
    destination: "",
    startLandmark: "",
    endLandmark: "",
    date: "",
    vehicleType: "",
    capacity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "source" && value.length >= 1) {
      fetchCitySuggestions(value, "source");
    } else if (name === "destination" && value.length >= 1) {
      fetchCitySuggestions(value, "destination");
    }
  };

  // Fetch User Details based on Email
  const fetchUserDetails = async (email) => {
    if (!email) return;

    try {
      const response = await fetch(
        "https://samaan-pooling.onrender.com/api/users/getByEmail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "User not found");
      }

      const data = await response.json();
      setFormData((prevData) => ({
        ...prevData,
        carrierName: data.name,
      }));
    } catch (err) {
      setError(err.message);
      setFormData((prevData) => ({ ...prevData, carrierName: "" }));
    }
  };

  // Fetch City Suggestions (Updated API endpoint)
  const fetchCitySuggestions = async (query, field) => {
    try {
      const response = await fetch(
        `https://samaan-pooling.onrender.com/api/cities/search?query=${query}`
      );
      if (!response.ok) throw new Error("Failed to fetch city suggestions");

      const data = await response.json();
      if (field === "source") {
        setSourceSuggestions(data);
      } else {
        setDestinationSuggestions(data);
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  // Select City from Suggestions
  const handleSelectCity = (city, field) => {
    setFormData({ ...formData, [field]: city });
    if (field === "source") setSourceSuggestions([]);
    else setDestinationSuggestions([]);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://samaan-pooling.onrender.com/api/trips/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

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
        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-6">
          Add New Trip
        </h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    handleChange(e);
                    fetchUserDetails(e.target.value);
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Carrier Name
                </label>
                <input
                  type="text"
                  name="carrierName"
                  value={formData.carrierName}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                  readOnly
                />
              </div>

              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Source
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
                {sourceSuggestions.length > 0 && (
                  <ul className="absolute w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-40 overflow-y-auto z-10">
                    {sourceSuggestions.map((city, index) => (
                      <li
                        key={index}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSelectCity(city, "source")}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Destination
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
                {destinationSuggestions.length > 0 && (
                  <ul className="absolute w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-40 overflow-y-auto z-10">
                    {destinationSuggestions.map((city, index) => (
                      <li
                        key={index}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSelectCity(city, "destination")}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              
              {["startLandmark", "endLandmark", "vehicleType", "capacity"].map(
                (key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      required
                    />
                  </div>
                )
              )}

              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
