import React from 'react';
import { MapPin, Calendar, Package, Star, MessageCircle, Shield, Clock } from 'lucide-react';

export const CarrierDetails = () => {
  const carrier = {
    id: 1,
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4.8,
    trips: 24,
    from: 'London',
    to: 'Paris',
    date: '2024-03-25',
    capacity: '10kg',
    price: '$50',
    verifiedIdentity: true,
    responseRate: '98%',
    responseTime: '< 1 hour'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center">
              <img className="h-16 w-16 rounded-full" src={carrier.avatar} alt={carrier.name} />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{carrier.name}</h1>
                <div className="mt-2 flex items-center">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium text-gray-900">{carrier.rating}</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{carrier.trips} trips</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Trip Details</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">
                  {carrier.from} to {carrier.to}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">{carrier.date}</span>
              </div>
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Up to {carrier.capacity}</span>
              </div>
            </div>
          </div>

          {/* Trust & Verification */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Trust & Verification</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="ml-2 text-sm text-gray-500">
                  {carrier.verifiedIdentity ? 'Identity Verified' : 'Identity Not Verified'}
                </span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <span className="ml-2 text-sm text-gray-500">Response Rate: {carrier.responseRate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-purple-500" />
                <span className="ml-2 text-sm text-gray-500">Response Time: {carrier.responseTime}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-indigo-600">{carrier.price}</span>
                <span className="ml-2 text-sm text-gray-500">per package</span>
              </div>
              <div className="mt-4 sm:mt-0 space-x-4">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Message
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};