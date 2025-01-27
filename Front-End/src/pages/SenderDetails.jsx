import React from 'react';
import { Package, MapPin, Calendar, MessageCircle, DollarSign } from 'lucide-react';

export const SenderDetails = () => {
  const package_details = {
    id: "PKG123",
    sender: {
      name: "Alice Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 4.9,
      packages: 15
    },
    from: "London",
    to: "Paris",
    weight: "2.5kg",
    dimensions: "30x20x15cm",
    description: "Fragile electronics equipment",
    deadline: "2024-03-25",
    budget: "$50",
    status: "pending"
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img className="h-16 w-16 rounded-full" src={package_details.sender.avatar} alt={package_details.sender.name} />
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">{package_details.sender.name}</h1>
                  <div className="mt-2 flex items-center">
                    <span className="text-sm font-medium text-gray-900">★ {package_details.sender.rating}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{package_details.sender.packages} packages sent</span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {package_details.status}
                </span>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Package Details</h2>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <div className="flex items-center mb-4">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    Package ID: {package_details.id}
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    From {package_details.from} to {package_details.to}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    Deadline: {package_details.deadline}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    Weight: {package_details.weight}
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    Dimensions: {package_details.dimensions}
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    Budget: {package_details.budget}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-4 text-sm text-gray-500">{package_details.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-indigo-600">{package_details.budget}</span>
                <span className="ml-2 text-sm text-gray-500">budget</span>
              </div>
              <div className="mt-4 sm:mt-0 space-x-4">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Message Sender
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Offer to Carry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};