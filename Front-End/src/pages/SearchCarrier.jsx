import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircle } from "lucide-react";

export const SearchCarrier = () => {
  const [searchParams, setSearchParams] = useState({ source: "", destination: "", date: "" });
  const [carriers, setCarriers] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const navigate = useNavigate();

  // Get sender's email and role from localStorage
  const senderEmail = localStorage.getItem("email");
  const userRole = localStorage.getItem("userRole");

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    // Format the date to match `LocalDate` format (`YYYY-MM-DD`)
    let formattedDate = "";
    if (searchParams.date) {
      formattedDate = new Date(searchParams.date).toISOString().split("T")[0];
    }

    try {
      const response = await axios.get("http://localhost:8080/api/trips/search", {
        params: {
          source: searchParams.source,
          destination: searchParams.destination,
          date: formattedDate,
        },
      });
      setCarriers(response.data);

      // Fetch prices for each carrier
      const priceData = {};
      await Promise.all(
          response.data.map(async (carrier) => {
            try {
              const priceResponse = await axios.get("http://localhost:8080/api/price/calculate", {
                params: { source: searchParams.source, destination: searchParams.destination },
              });
              priceData[carrier.id] = priceResponse.data.price;
            } catch (priceError) {
              console.error("Price calculation failed for carrier:", carrier.id);
              priceData[carrier.id] = "N/A";
            }
          })
      );

      setPrices(priceData);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch data. Please try again.");
    }

    setLoading(false);
  };

  const handleChat = (selectedTrip) => {
    const carrierEmail = selectedTrip.email; // Fetch from trip data

    if (!carrierEmail) {
      alert("Carrier email not found!");
      return;
    }

    navigate("/join-chat", { state: { carrierEmail } });
  };

  // Fetch city suggestions
  const fetchCitySuggestions = async (query, type) => {
    if (!query) {
      type === "source" ? setSourceSuggestions([]) : setDestinationSuggestions([]);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/api/cities/search", { params: { query } });
      if (type === "source") {
        setSourceSuggestions(response.data);
      } else {
        setDestinationSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Source Field with Suggestions */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">From</label>
                <input
                    type="text"
                    className="block w-full pl-3 sm:text-sm border-gray-300 rounded-md"
                    placeholder="City"
                    value={searchParams.source}
                    onChange={(e) => {
                      setSearchParams({ ...searchParams, source: e.target.value });
                      fetchCitySuggestions(e.target.value, "source");
                    }}
                />
                {sourceSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg max-h-40 overflow-auto">
                      {sourceSuggestions.map((city, index) => (
                          <li
                              key={index}
                              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                              onClick={() => {
                                setSearchParams({ ...searchParams, source: city });
                                setSourceSuggestions([]);
                              }}
                          >
                            {city}
                          </li>
                      ))}
                    </ul>
                )}
              </div>

              {/* Destination Field with Suggestions */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">To</label>
                <input
                    type="text"
                    className="block w-full pl-3 sm:text-sm border-gray-300 rounded-md"
                    placeholder="City"
                    value={searchParams.destination}
                    onChange={(e) => {
                      setSearchParams({ ...searchParams, destination: e.target.value });
                      fetchCitySuggestions(e.target.value, "destination");
                    }}
                />
                {destinationSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg max-h-40 overflow-auto">
                      {destinationSuggestions.map((city, index) => (
                          <li
                              key={index}
                              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                              onClick={() => {
                                setSearchParams({ ...searchParams, destination: city });
                                setDestinationSuggestions([]);
                              }}
                          >
                            {city}
                          </li>
                      ))}
                    </ul>
                )}
              </div>

              {/* Date Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                    type="date"
                    className="block w-full pl-3 sm:text-sm border-gray-300 rounded-md"
                    value={searchParams.date}
                    onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                />
              </div>
            </div>
            <button onClick={handleSearch} className="w-full md:w-auto mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Carriers
            </button>
          </div>

          {/* Results */}
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          <div className="space-y-6">
            {carriers.length === 0 && !loading && !error && <p className="text-center text-gray-500">No carriers found.</p>}
            {carriers.map((carrier) => (
                <div key={carrier.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{carrier.carrierName}</h3>
                      <p className="text-sm text-gray-500">{carrier.source} → {carrier.destination}</p>
                      <p className="text-sm text-gray-500">Start Landmark: {carrier.startLandmark}</p>
                      <p className="text-sm text-gray-500">End Landmark: {carrier.endLandmark}</p>
                      <p className="text-sm text-gray-500">Vehicle Type: {carrier.vehicleType}</p>
                    </div>
                    {userRole === "sender" && (
                        <button onClick={() => handleChat(carrier)} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center">
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Chat
                        </button>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};
