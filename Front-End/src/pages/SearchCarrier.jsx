import React, { useState } from 'react';
import { Search, MapPin, Calendar, Package } from 'lucide-react';

export const SearchCarrier = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    weight: ''
  });

  const carriers = [
    {
      id: 1,
      name: 'John Doe',
      from: 'London',
      to: 'Paris',
      date: '2024-03-25',
      capacity: '10kg',
      price: '$50',
      rating: 4.8,
      trips: 24
    },
    {
      id: 2,
      name: 'Jane Smith',
      from: 'Berlin',
      to: 'Amsterdam',
      date: '2024-03-26',
      capacity: '5kg',
      price: '$35',
      rating: 4.9,
      trips: 15
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  value={searchParams.from}
                  onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
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
                  value={searchParams.to}
                  onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Package Weight</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Weight in kg"
                  value={searchParams.weight}
                  onChange={(e) => setSearchParams({ ...searchParams, weight: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button className="w-full md:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Search className="h-5 w-5 mr-2" />
              Search Carriers
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {carriers.map((carrier) => (
            <div key={carrier.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{carrier.name}</h3>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {carrier.from} to {carrier.to}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {carrier.date}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Package className="h-4 w-4 mr-1" />
                    Up to {carrier.capacity}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <p className="text-2xl font-bold text-indigo-600">{carrier.price}</p>
                  <div className="mt-2 flex items-center">
                    <span className="text-sm font-medium text-gray-900">★ {carrier.rating}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{carrier.trips} trips</span>
                  </div>
                  <button className="mt-4 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    View Details
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