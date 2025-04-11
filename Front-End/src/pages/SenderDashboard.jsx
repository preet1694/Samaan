import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Clock } from "lucide-react";
import ReactStars from "react-stars";
import toast, { Toaster } from "react-hot-toast";

export const SenderDashboard = () => {
  const navigate = useNavigate();
  const senderEmail = localStorage.getItem("email");

  const [selectedTrips, setSelectedTrips] = useState([]);
  const [ratings, setRatings] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [ratedTrips, setRatedTrips] = useState({});
  const [cancelledTrips, setCancelledTrips] = useState({});
  const [cancelStatus, setCancelStatus] = useState({});
  const [cancelModalTripId, setCancelModalTripId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const tripsPerPage = 5;

  const fetchSelectedTrips = async () => {
    try {
      const response = await axios.get(
        `https://samaan-pooling.onrender.com/api/trips/sender/${senderEmail}`
      );
      const sortedTrips = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setSelectedTrips(sortedTrips);

      const ratingsResponse = await axios.get(
        `https://samaan-pooling.onrender.com/api/trips/ratings/${senderEmail}`
      );

      const fetchedRatings = {};
      const fetchedFeedbacks = {};
      const fetchedRatedTrips = {};
      const fetchedCancelled = {};
      const fetchedCancelStatus = {};

      ratingsResponse.data.forEach((trip) => {
        fetchedRatings[trip.id] = trip.rating;
        fetchedFeedbacks[trip.id] = trip.feedback || "";
        fetchedRatedTrips[trip.id] = true;
      });

      sortedTrips.forEach((trip) => {
        if (trip.cancelled) fetchedCancelled[trip.id] = true;
        if (trip.cancelRequestedBy) {
          const isRequested = !trip.cancelled;
          fetchedCancelStatus[trip.id] = {
            requestedBy: trip.cancelRequestedBy,
            status: isRequested ? "requested" : "cancelled",
          };
        }
      });

      setRatings(fetchedRatings);
      setFeedbacks(fetchedFeedbacks);
      setRatedTrips(fetchedRatedTrips);
      setCancelledTrips(fetchedCancelled);
      setCancelStatus(fetchedCancelStatus);
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast.error("Failed to load trip data.");
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
      toast.error("Please provide a rating before submitting.");
      return;
    }

    try {
      await axios.post(
        `https://samaan-pooling.onrender.com/api/trips/rating/${tripId}`,
        { tripId, rating, feedback },
        { headers: { "Content-Type": "application/json" } }
      );
      setRatedTrips((prev) => ({ ...prev, [tripId]: true }));
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit feedback.");
    }
  };

  const cancelTrip = (tripId) => {
    setCancelModalTripId(tripId);
  };

  const confirmCancelTrip = async (tripId) => {
    try {
      await axios.post(
        `https://samaan-pooling.onrender.com/api/trips/${tripId}/cancel?role=sender`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setCancelStatus((prev) => ({
        ...prev,
        [tripId]: {
          requestedBy: senderEmail,
          status: "requested",
        },
      }));

      toast.success("Cancellation request sent.");
    } catch (error) {
      console.error("Error requesting cancellation:", error);
      toast.error("Failed to request cancellation.");
    } finally {
      setCancelModalTripId(null);
    }
  };

  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = selectedTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(selectedTrips.length / tripsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f4fd] to-white px-4 md:px-8 py-10">
      <Toaster position="top-right" />
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        Your Selected Trips
      </h2>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
          <thead className="bg-indigo-100">
            <tr>
              <TableHeader>#</TableHeader>
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
              Array.from({ length: tripsPerPage }).map((_, idx) => (
                <SkeletonRow key={idx} />
              ))
            ) : selectedTrips.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No trips found.
                </td>
              </tr>
            ) : (
              currentTrips.map((trip, idx) => {
                const cancelInfo = cancelStatus[trip.id];
                const showCancel =
                  !cancelledTrips[trip.id] &&
                  !trip.carrierCompleted &&
                  (!cancelStatus[trip.id] ||
                    cancelStatus[trip.id].status !== "requested");

                return (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <TableData>{indexOfFirstTrip + idx + 1}</TableData>
                    <TableData>#{trip.id}</TableData>
                    <TableData>{trip.carrierName}</TableData>
                    <TableData>{trip.source}</TableData>
                    <TableData>{trip.destination}</TableData>
                    <TableData>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full inline-flex items-center ${
                          trip.carrierCompleted
                            ? "bg-green-100 text-green-700"
                            : cancelledTrips[trip.id]
                            ? "bg-red-100 text-red-700"
                            : cancelInfo?.status === "requested"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {trip.carrierCompleted ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" /> Completed
                          </>
                        ) : cancelledTrips[trip.id] ? (
                          <>❌ Cancelled</>
                        ) : cancelInfo?.status === "requested" ? (
                          <>⌛ Cancellation Requested</>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 mr-1" /> Pending
                          </>
                        )}
                      </span>
                    </TableData>

                    <TableData>
                      {trip.senderSelected && trip.carrierCompleted ? (
                        <div className="flex flex-col space-y-2">
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
                            className="p-2 border rounded text-sm text-gray-700 bg-gray-50"
                            placeholder="Write feedback..."
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
                              onClick={() => submitRatingAndFeedback(trip.id)}
                              className="mt-1 px-4 py-1.5 text-sm rounded text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              Submit
                            </button>
                          ) : (
                            <span className="text-green-600 text-sm font-semibold">
                              Feedback Submitted
                            </span>
                          )}
                        </div>
                      ) : showCancel ? (
                        <button
                          onClick={() => cancelTrip(trip.id)}
                          className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-full hover:bg-red-200 transition"
                        >
                          Cancel Trip
                        </button>
                      ) : cancelInfo?.status === "requested" ? (
                        <span className="text-yellow-600 text-sm font-medium">
                          Cancel Requested
                        </span>
                      ) : null}
                    </TableData>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && selectedTrips.length > tripsPerPage && (
        <div className="flex justify-center mt-6 space-x-4">
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

      {cancelModalTripId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Cancellation
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to request cancellation? It will only be
              completed when both sides agree.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCancelModalTripId(null)}
                className="px-4 py-1.5 text-sm rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={() => confirmCancelTrip(cancelModalTripId)}
                className="px-4 py-1.5 text-sm rounded bg-red-500 text-white hover:bg-red-600"
              >
                Yes, Request Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TableHeader = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
    {children}
  </th>
);

const TableData = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>
);

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 7 }).map((_, idx) => (
      <td key={idx} className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto animate-pulse" />
      </td>
    ))}
  </tr>
);
