import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircle } from "lucide-react";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

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

    let formattedDate = searchParams.date ? new Date(searchParams.date).toISOString().split("T")[0] : "";

    try {
      const response = await axios.get("https://samaan-pooling.onrender.com/api/trips/search", {
        params: {
          source: searchParams.source,
          destination: searchParams.destination,
          date: formattedDate,
        },
      });
      setCarriers(response.data);

      const priceData = {};
      await Promise.all(
        response.data.map(async (carrier) => {
          try {
            const priceResponse = await axios.get("https://samaan-pooling.onrender.com/api/price/calculate", {
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

  const handleChat = async (selectedTrip) => {
    const carrierEmail = selectedTrip.email;
    if (!carrierEmail || !senderEmail) {
      alert("Email details missing. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        "https://samaan-pooling.onrender.com/api/v1/rooms",
        null,
        { params: { senderEmail, carrierEmail } }
      );

      const roomId = response.data.roomId;
      if (!roomId) {
        alert("Failed to get chat room ID.");
        return;
      }

      localStorage.setItem("roomId", roomId);
      navigate(`/join-chat/${roomId}`, { state: { roomId, carrierEmail } });
    } catch (error) {
      console.error("Error creating chat room:", error);
      alert("Error creating chat room. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Source Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">From</label>
              <input type="text" className="block w-full pl-3 sm:text-sm border-gray-300 rounded-md" placeholder="City"
                value={searchParams.source}
                onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
              />
            </div>

            {/* Destination Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">To</label>
              <input type="text" className="block w-full pl-3 sm:text-sm border-gray-300 rounded-md" placeholder="City"
                value={searchParams.destination}
                onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
              />
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" className="block w-full pl-3 sm:text-sm border-gray-300 rounded-md"
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

        {/* Loading Shimmer Effect */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg shadow-lg p-6">
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-20 mt-4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && carriers.length === 0 && !error && <p className="text-center text-gray-500">No carriers found.</p>}
        {!loading && carriers.length > 0 && (
          <div className="space-y-6">
            {carriers.map((carrier) => (
              <div key={carrier.id} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold">{carrier.carrierName}</h3>
                <p className="text-sm text-gray-500">{capitalizeFirstLetter(carrier.source)} → {capitalizeFirstLetter(carrier.destination)}</p>
                <p className="text-sm text-gray-500">Vehicle Type: <b>{carrier.vehicleType.toUpperCase()}</b></p>
                <p className="text-sm text-green-600 font-semibold">Estimated Price: ₹{prices[carrier.id] || "Calculating..."}</p>
                
                {userRole === "sender" ? (
                  <button onClick={() => handleChat(carrier)} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat
                  </button>
                ) : (
                  <p>Please Log In to Chat</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
