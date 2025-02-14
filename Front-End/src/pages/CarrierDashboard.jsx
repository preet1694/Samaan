import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Package, MapPin, Calendar, DollarSign } from "lucide-react";

export const CarrierDashboard = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserEmail(user.email);
      fetchTrips(user.email);
    }
  }, []);

  // Fetch trips based on logged-in user's email
  const fetchTrips = async (email) => {
    try {
      const response = await axios.get("http://localhost:8080/api/trips", {
        params: { email },
      });
      console.log("Trips Data:", response.data);
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard icon={<Package />} title="Active Trips" value={trips.length} />
            <DashboardCard icon={<MapPin />} title="Total Destinations" value={new Set(trips.map(trip => trip.destination)).size} />
            <DashboardCard icon={<Calendar />} title="Upcoming Trips" value={trips.filter(trip => new Date(trip.date) > new Date()).length} />
            <DashboardCard icon={<DollarSign />} title="Total Earnings" value={`$${trips.reduce((acc, trip) => acc + trip.price, 0)}`} />
          </div>

          {/* Trips Table */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Your Trips</h2>
              <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => navigate("/add-trip")}
              >
                Add New Trip
              </button>
            </div>

            <div className="mt-4 flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                      {trips.length > 0 ? (
                          trips.map((trip) => (
                              <tr key={trip._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{trip._id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.source}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.destination}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.capacity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${trip.price}</td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                              No trips available.
                            </td>
                          </tr>
                      )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

// Reusable Dashboard Card Component
const DashboardCard = ({ icon, title, value }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
);
