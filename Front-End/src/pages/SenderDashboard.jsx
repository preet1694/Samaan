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
  const [ratedTrips, setRatedTrips] = useState({}); // Track submitted trips

  useEffect(() => {
    fetchSelectedTrips();
  }, []);

  const fetchSelectedTrips = async () => {
    try {
      const response = await axios.get(
        `https://samaan-pooling.onrender.com/api/trips/sender/${senderEmail}`
      );
      setSelectedTrips(response.data);

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
        acc[trip.id] = true; // Mark as rated if exists in DB
        return acc;
      }, {});

      setRatings(fetchedRatings);
      setFeedbacks(fetchedFeedbacks);
      setRatedTrips(fetchedRatedTrips);
    } catch (error) {
      console.error("Error fetching trips or ratings:", error);
    }
  };

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

      setRatedTrips((prev) => ({ ...prev, [tripId]: true })); // Mark as rated after submission
    } catch (error) {
      console.error("Error submitting rating and feedback:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900">Your Selected Trips</h2>

      <div className="mt-4 flex flex-col">
        <div className="overflow-x-auto">
          <div className="py-2 inline-block min-w-full">
            <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Trip ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Carrier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Rating & Feedback
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedTrips.map((trip) => (
                    <tr key={trip.id}>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        #{trip.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {trip.carrierName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {trip.source}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {trip.destination}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            trip.carrierCompleted
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {trip.carrierCompleted ? (
                            <>
                              <CheckCircle className="h-4 w-4 inline-block mr-1" />{" "}
                              Completed
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 inline-block mr-1" />{" "}
                              Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {trip.senderSelected && trip.carrierCompleted ? (
                          <div className="flex flex-col">
                            <ReactStars
                              count={5}
                              size={24}
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
                              edit={!ratedTrips[trip.id]} // Disable stars if already rated
                            />
                            <textarea
                              className="mt-2 p-2 w-full border rounded bg-white text-gray-800"
                              placeholder="Write your feedback..."
                              value={feedbacks[trip.id] || ""}
                              onChange={(e) =>
                                !ratedTrips[trip.id] &&
                                setFeedbacks((prev) => ({
                                  ...prev,
                                  [trip.id]: e.target.value,
                                }))
                              }
                              disabled={ratedTrips[trip.id]} // Disable feedback input if already rated
                            />
                            {!ratedTrips[trip.id] ? (
                              <button
                                className={`mt-2 px-4 py-2 rounded text-white ${
                                  !ratings[trip.id]
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                                }`}
                                onClick={() => submitRatingAndFeedback(trip.id)}
                                disabled={!ratings[trip.id]}
                              >
                                Submit
                              </button>
                            ) : (
                              <span className="text-green-600 text-sm font-semibold mt-2">
                                Feedback Submitted
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            Not available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {selectedTrips.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-500"
                      >
                        No trips found
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
  );
};
