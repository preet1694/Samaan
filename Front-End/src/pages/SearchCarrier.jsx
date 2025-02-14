import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Calendar, Truck, MessageCircle } from 'lucide-react';

export const SearchCarrier = () => {
  const [searchParams, setSearchParams] = useState({ source: '', destination: '', date: '' });
  const [carriers, setCarriers] = useState([]);
  const [prices, setPrices] = useState({}); // Store prices from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/trips/search`, {
        params: {
          source: searchParams.source,
          destination: searchParams.destination,
          date: searchParams.date,
        },
      });
      setCarriers(response.data);

      // Fetch price for each carrier
      const priceData = {};
      await Promise.all(
          response.data.map(async (carrier) => {
            try {
              const priceResponse = await axios.get(`http://localhost:8080/api/price/calculate`, {
                params: { source: searchParams.source,
                  destination: searchParams.destination,},
              });
              priceData[carrier.id] = priceResponse.data.price;
            } catch (priceError) {
              console.error("Price calculation failed for carrier:", carrier.id);
              priceData[carrier.id] = "N/A"; // Handle failure case
            }
          })
      );

      setPrices(priceData);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }
    setLoading(false);
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">From</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="text"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="City"
                      value={searchParams.source}
                      onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">To</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="text"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="City"
                      value={searchParams.destination}
                      onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="date"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={searchParams.date}
                      onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                  onClick={handleSearch}
                  className="w-full md:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Carriers
              </button>
            </div>
          </div>

          {/* Results */}
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          <div className="space-y-6">
            {carriers.length === 0 && !loading && !error && (
                <p className="text-center text-gray-500">No carriers found.</p>
            )}
            {carriers.map((carrier) => (
                <div key={carrier.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{carrier.carrierName}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        <MapPin className="inline h-4 w-4 text-indigo-500 mr-1" />
                        {carrier.source} → {carrier.destination}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-semibold">Start Landmark:</span> {carrier.startLandmark}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-semibold">End Landmark:</span> {carrier.endLandmark}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        <Truck className="inline h-4 w-4 text-indigo-500 mr-1" />
                        <span className="font-semibold">Vehicle Type:</span> {carrier.vehicleType}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      {/* Price Calculation with Rupee Symbol */}
                      <p className="text-2xl font-bold text-indigo-600">
                        ₹{prices[carrier.id] !== undefined ? prices[carrier.id] : "Calculating..."}
                      </p>
                      <button className="mt-4 px-4 py-2 border text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 flex items-center">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};
