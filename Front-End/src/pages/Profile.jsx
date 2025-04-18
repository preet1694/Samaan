import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, Shield } from "lucide-react";
import profileimg from "../assets/profile.jpg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phoneError, setPhoneError] = useState(null);
  const storedEmail = localStorage.getItem("email");

  const fetchProfile = async () => {
    try {
      if (!storedEmail) {
        console.error("No email found in localStorage");
        return;
      }

      const response = await axios.post(
        "https://samaan-pooling.onrender.com/api/users/getByEmail",
        { email: storedEmail }
      );

      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [storedEmail]);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const updateProfile = async () => {
    if (!validatePhoneNumber(profile.phoneNumber)) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      await axios.post(
        "https://samaan-pooling.onrender.com/api/users/update",
        profile
      );
      alert("Profile updated successfully!");
      setIsEditing(false);
      setPhoneError(null);
      fetchProfile(); // Re-fetch updated data
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-40 bg-indigo-600">
            <div className="absolute -bottom-14 left-8">
              <div className="relative">
                {loading ? (
                  <Skeleton circle height={128} width={128} />
                ) : (
                  <img
                    className="h-32 w-32 rounded-full ring-4 ring-white z-10"
                    src={profile.avatar || profileimg}
                    alt="Profile"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="pt-24 px-8 pb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {loading ? <Skeleton width={150} /> : profile.name}
                </h1>
                <p className="text-sm text-gray-500 capitalize">
                  {loading ? <Skeleton width={100} /> : profile.role}
                </p>
              </div>
              <button
                onClick={() =>
                  isEditing ? updateProfile() : setIsEditing(true)
                }
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            <div className="flex space-x-4 mb-8">
              {loading ? (
                <Skeleton width={100} height={25} />
              ) : (
                profile.verifiedIdentity && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <Shield className="h-4 w-4 mr-1" />
                    Verified Identity
                  </span>
                )
              )}
              {loading ? (
                <Skeleton width={100} height={25} />
              ) : (
                profile.verifiedPhone && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Phone className="h-4 w-4 mr-1" />
                    Verified Phone
                  </span>
                )
              )}
              {loading ? (
                <Skeleton width={100} height={25} />
              ) : (
                profile.verifiedEmail && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    <Mail className="h-4 w-4 mr-1" />
                    Verified Email
                  </span>
                )
              )}
            </div>

            <div className="space-y-6">
              {["Full Name", "Email", "Phone", "Address"].map(
                (field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {index === 0 ? (
                          <User className="h-5 w-5 text-gray-400" />
                        ) : index === 1 ? (
                          <Mail className="h-5 w-5 text-gray-400" />
                        ) : index === 2 ? (
                          <Phone className="h-5 w-5 text-gray-400" />
                        ) : (
                          <MapPin className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      {loading ? (
                        <Skeleton height={36} />
                      ) : (
                        <input
                          type={index === 1 ? "email" : "text"}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          value={
                            index === 0
                              ? profile.name || ""
                              : index === 1
                              ? profile.email || ""
                              : index === 2
                              ? profile.phoneNumber || ""
                              : profile.address || ""
                          }
                          disabled={index === 1 || !isEditing}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (index === 0)
                              setProfile((prev) => ({
                                ...prev,
                                name: value,
                              }));
                            if (index === 2)
                              setProfile((prev) => ({
                                ...prev,
                                phoneNumber: value,
                              }));
                            if (index === 3)
                              setProfile((prev) => ({
                                ...prev,
                                address: value,
                              }));
                          }}
                        />
                      )}
                    </div>
                    {phoneError && index === 2 && (
                      <p className="text-red-500 text-xs">{phoneError}</p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
