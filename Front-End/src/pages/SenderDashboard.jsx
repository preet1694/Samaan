import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Clock } from "lucide-react";
import ReactStars from "react-stars";

export const SenderDashboard = () => {
  const navigate = useNavigate();
  const senderEmail = localStorage.getItem("email");
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [ratings, setRatings] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [ratedTrips, setRatedTrips] = useState({});
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 5;

  const fetchSelectedTrips = async () => {
    try {
      const response = await axios.get(
        `https://samaan-pooling.onrender.com/api/trips/sender/${senderEmail}`
      );

      // 🆕 Sort by latest date first
      const sortedTrips = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setSelectedTrips(sortedTrips);

      const ratingsResponse = await axios.get(
        `https://samaan-pooling.onrender.com/api/trips/ratings/${senderEmail}`
      );

      const fetchedRatings = ratingsResponse.data.reduce((acc, trip) => {
        acc[trip.id] = trip.rating;
        return acc;
      }, {});

      const fetchedFeedbacks = ratingsResponse.data.reduce((acc, trip) => {
        acc[trip.id] = trip.feedback || "";
        return acc;
      }, {});

      const fetchedRatedTrips = ratingsResponse.data.reduce((acc, trip) => {
        acc[trip.id] = true;
        return acc;
      }, {});

      setRatings(fetchedRatings);
      setFeedbacks(fetchedFeedbacks);
      setRatedTrips(fetchedRatedTrips);
    } catch (error) {
      console.error("Error fetching trips or ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedTrips();
  }, []);

  const submitRatingAndFeedback = async (tripId) => {
    const rating = ratings[tripId];
    const feedback = feedbacks[tripId];

    if (!rating) {
      alert("Please provide a rating before submitting.");
      return;
    }

    try {
      await axios.post(
        `https://samaan-pooling.onrender.com/api/trips/rating/${tripId}`,
        { tripId, rating, feedback },
        { headers: { "Content-Type": "application/json" } }
      );
      setRatedTrips((prev) => ({ ...prev, [tripId]: true }));
    } catch (error) {
      console.error("Error submitting rating and feedback:", error);
    }
  };

  // Pagination Logic
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = selectedTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(selectedTrips.length / tripsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f4fd] to-white px-4 md:px-8 py-10 transition-all duration-500 ease-in-out">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 animate-fade-in">
        Your Selected Trips
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-md bg-white animate-slide-up-fade transition-all duration-500">
        <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
          <thead className="bg-indigo-100">
            <tr>
              <TableHeader></TableHeader>
              <TableHeader>Trip ID</TableHeader>
              <TableHeader>Carrier</TableHeader>
              <TableHeader>Source</TableHeader>
              <TableHeader>Destination</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Rating & Feedback</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: tripsPerPage }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : selectedTrips.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No trips found.
                </td>
              </tr>
            ) : (
              currentTrips.map((trip, index) => (
                <tr
                  key={trip.id}
                  className="hover:bg-gray-50 transition-all duration-300 ease-in-out"
                >
                  <TableData>{indexOfFirstTrip + index + 1}</TableData>
                  <TableData className="break-words max-w-[120px]">
                    #{trip.id || "-"}
                  </TableData>
                  <TableData>{trip.carrierName || "-"}</TableData>
                  <TableData>{trip.source || "-"}</TableData>
                  <TableData>{trip.destination || "-"}</TableData>
                  <TableData>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full inline-flex items-center ${
                        trip.carrierCompleted
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {trip.carrierCompleted ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" /> Completed
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 mr-1" /> Pending
                        </>
                      )}
                    </span>
                  </TableData>
                  <TableData>
                    {trip.senderSelected && trip.carrierCompleted ? (
                      <div className="flex flex-col space-y-2 animate-fade-in">
                        <ReactStars
                          count={5}
                          size={20}
                          half={false}
                          value={ratings[trip.id] || 0}
                          onChange={(newRating) =>
                            !ratedTrips[trip.id] &&
                            setRatings((prev) => ({
                              ...prev,
                              [trip.id]: newRating,
                            }))
                          }
                          color2={"#ffd700"}
                          edit={!ratedTrips[trip.id]}
                        />
                        <textarea
                          className="p-2 border border-gray-300 rounded bg-gray-50 resize-none text-sm text-gray-700"
                          placeholder="Write your feedback..."
                          value={feedbacks[trip.id] || ""}
                          onChange={(e) =>
                            !ratedTrips[trip.id] &&
                            setFeedbacks((prev) => ({
                              ...prev,
                              [trip.id]: e.target.value,
                            }))
                          }
                          disabled={ratedTrips[trip.id]}
                        />
                        {!ratedTrips[trip.id] ? (
                          <button
                            className={`mt-1 px-4 py-1.5 rounded text-white text-xs md:text-sm transition-all duration-300 ${
                              !ratings[trip.id]
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                            onClick={() => submitRatingAndFeedback(trip.id)}
                            disabled={!ratings[trip.id]}
                          >
                            Submit
                          </button>
                        ) : (
                          <span className="text-green-600 text-sm font-semibold">
                            Feedback Submitted
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm italic">
                        Not available
                      </span>
                    )}
                  </TableData>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && selectedTrips.length > tripsPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-indigo-500 text-white text-sm rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 bg-indigo-500 text-white text-sm rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Table Header Cell
const TableHeader = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
    {children}
  </th>
);

// Table Data Cell
const TableData = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>
);

// Skeleton Row for Loading
const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 7 }).map((_, idx) => (
      <td key={idx} className="px-4 py-3">
        <div className="relative overflow-hidden h-4 rounded bg-gray-200 w-5/6 mx-auto">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
      </td>
    ))}
  </tr>
);
