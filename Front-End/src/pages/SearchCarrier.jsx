import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { Search, MessageCircle, CheckCircle } from "lucide-react";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="flex gap-4 mt-4">
      <div className="h-10 bg-gray-300 w-24 rounded-md"></div>
      <div className="h-10 bg-gray-300 w-32 rounded-md"></div>
    </div>
  </div>
);

export const SearchCarrier = () => {
  const [searchParams, setSearchParams] = useState({
    source: "",
    destination: "",
    date: "",
  });
  const [carriers, setCarriers] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);

  const navigate = useNavigate();
  const todayDate = new Date().toISOString().split("T")[0];
  const senderEmail = localStorage.getItem("email");
  const userRole = localStorage.getItem("userRole");

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    let formattedDate = searchParams.date
      ? new Date(searchParams.date).toISOString().split("T")[0]
      : "";

    try {
      const response = await axios.get(
        "https://samaan-pooling.onrender.com/api/trips/search",
        {
          params: {
            source: searchParams.source,
            destination: searchParams.destination,
            date: formattedDate,
          },
        }
      );
      setCarriers(response.data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch data. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (carriers.length > 0) {
      const fetchPrices = async () => {
        const priceData = {};
        await Promise.all(
          carriers.map(async (carrier) => {
            try {
              const priceResponse = await axios.get(
                "https://samaan-pooling.onrender.com/api/price/calculate",
                {
                  params: {
                    source: searchParams.source,
                    destination: searchParams.destination,
                  },
                }
              );
              priceData[carrier.id] = priceResponse.data.price;
            } catch {
              priceData[carrier.id] = "N/A";
            }
          })
        );
        setPrices(priceData);
      };
      fetchPrices();
    }
  }, [carriers, searchParams.source, searchParams.destination]);

  const handleChat = (selectedTrip) => {
    const carrierEmail = selectedTrip.email;
    if (!carrierEmail) return alert("Carrier email not found!");
    const roomId = `${senderEmail}_${carrierEmail}`;
    localStorage.setItem("roomId", roomId);
    navigate(`/join-chat?roomId=${roomId}`, {
      state: { senderEmail, carrierEmail },
    });
  };

  const handleSelectCarrier = async (trip) => {
    if (!senderEmail)
      return alert("Please log in as a sender to select a carrier.");
    try {
      await axios.post("https://samaan-pooling.onrender.com/api/trips/select", {
        senderEmail,
        tripId: trip.id,
        carrierEmail: trip.email,
      });
      setSelectedTripId(trip.id);
      alert("Carrier selected successfully!");
    } catch (err) {
      console.error("Error selecting carrier:", err);
      alert("Failed to select carrier. Please try again.");
    }
  };

  const fetchCitySuggestions = debounce(async (query, type) => {
    if (!query) {
      type === "source"
        ? setSourceSuggestions([])
        : setDestinationSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        "https://samaan-pooling.onrender.com/api/cities/search",
        { params: { query } }
      );
      type === "source"
        ? setSourceSuggestions(response.data)
        : setDestinationSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  }, 300);

  return (
    <div className="min-h-screen bg-gray-50 py-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                From
              </label>
              <input
                type="text"
                className="block w-full pl-3 py-2 sm:text-sm border-gray-300 rounded-md shadow-sm"
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

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                To
              </label>
              <input
                type="text"
                className="block w-full pl-3 py-2 sm:text-sm border-gray-300 rounded-md shadow-sm"
                placeholder="City"
                value={searchParams.destination}
                onChange={(e) => {
                  setSearchParams({
                    ...searchParams,
                    destination: e.target.value,
                  });
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                min={todayDate}
                className="block w-full pl-3 py-2 sm:text-sm border-gray-300 rounded-md shadow-sm"
                value={searchParams.date}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, date: e.target.value })
                }
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="w-full md:w-auto mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Carriers
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {error && <p className="text-center text-red-500">{error}</p>}
            {carriers.length === 0 && !error && (
              <p className="text-center text-gray-500">No carriers found.</p>
            )}
            <div className="space-y-6">
              {carriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className="bg-white rounded-xl shadow-md p-6 transition-transform transform hover:scale-[1.01] hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg font-semibold">
                        {carrier.carrierName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {capitalizeFirstLetter(carrier.source)} →{" "}
                        {capitalizeFirstLetter(carrier.destination)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Start Landmark:{" "}
                        {capitalizeFirstLetter(carrier.startLandmark)}
                      </p>
                      <p className="text-sm text-gray-500">
                        End Landmark:{" "}
                        {capitalizeFirstLetter(carrier.endLandmark)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Vehicle Type: <b>{carrier.vehicleType.toUpperCase()}</b>
                      </p>
                      <p className="text-sm text-green-600 font-semibold mt-1">
                        Price: ₹ {prices[carrier.id] || "N/A"}
                      </p>
                    </div>

                    {userRole === "sender" ? (
                      <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0">
                        <button
                          onClick={() => handleChat(carrier)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition"
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Chat
                        </button>
                        <button
                          onClick={() => handleSelectCarrier(carrier)}
                          className={`px-4 py-2 rounded-md flex items-center transition 
                            ${
                              selectedTripId === carrier.id
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            } text-white`}
                        >
                          {selectedTripId === carrier.id && (
                            <CheckCircle className="h-5 w-5 mr-2" />
                          )}
                          {selectedTripId === carrier.id
                            ? "Selected"
                            : "Select Carrier"}
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-4 md:mt-0">
                        Please Log In as a Sender to Chat
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
