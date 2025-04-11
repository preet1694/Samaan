import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Package, MapPin, Calendar, DollarSign } from "lucide-react";

export const CarrierDashboard = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setUserEmail(storedEmail);
      fetchTrips(storedEmail);
    }
  }, []);

  const fetchTrips = async (email) => {
    try {
      const response = await axios.get(
        "https://samaan-pooling.onrender.com/api/trips/getusertrips",
        {
          params: { storedEmail: email },
        }
      );
      setTrips(response.data || []);
      console.log("Fetched trips:", response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const markTripAsCompleted = async (tripId) => {
    try {
      await axios.put(
        `https://samaan-pooling.onrender.com/api/trips/complete/${tripId}`
      );
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.id === tripId ? { ...trip, carrierCompleted: true } : trip
        )
      );
    } catch (error) {
      console.error("Error updating trip status:", error);
    }
  };

  const today = new Date(new Date().toDateString());

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            icon={<MapPin />}
            title="Total Destinations"
            value={
              new Set(
                trips
                  .filter((trip) => new Date(trip.date) >= today)
                  .map((trip) => trip.destination)
              ).size || 0
            }
          />
          <DashboardCard
            icon={<Calendar />}
            title="Upcoming Trips"
            value={
              trips.filter((trip) => new Date(trip.date) > today).length || 0
            }
          />
          <DashboardCard
            icon={<DollarSign />}
            title="Completed Trips"
            value={trips.filter((trip) => trip.carrierCompleted).length || 0}
          />
          <DashboardCard
            icon={<Package />}
            title="Pending Trips"
            value={trips.filter((trip) => !trip.carrierCompleted).length || 0}
          />
        </div>

        {/* Trip Table */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Your Trips
            </h2>
            <div className="flex space-x-4">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate("/chat")}
              >
                Chats
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate("/add-trip")}
              >
                Add New Trip
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Destination
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Capacity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {trips.length > 0 ? (
                        trips.map((trip, index) => (
                          <tr key={trip.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {trip.source}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {trip.destination}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {trip.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {trip.capacity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {trip.carrierCompleted ? (
                                <span className="text-green-600 font-semibold">
                                  Completed
                                </span>
                              ) : (
                                <span className="text-yellow-400 font-semibold">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
     {trip.carrierCompleted ? (
    <span className="text-green-600 font-semibold">Already Completed!!</span>
  ) : new Date(trip.date) > new Date() ? (
    <span className="text-yellow-600">Trip not started yet</span>
  ) : !trip.senderSelected ? (
    <span className="text-red-500 font-medium">No sender selected yet</span>
  ) : (
    <button
      className="px-3 py-1 text-white bg-green-600 hover:bg-green-700 rounded-md"
      onClick={() => markTripAsCompleted(trip.id)}
    >
      Mark as Completed
    </button>
  )}
</td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-6 py-4 text-center text-gray-500"
                          >
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

const DashboardCard = ({ icon, title, value }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);
