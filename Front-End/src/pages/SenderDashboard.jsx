import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Package, Search, Send, Clock } from 'lucide-react';

export const SenderDashboard = () => {
  const navigate = useNavigate(); // Hook for navigation


  return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <div className="flex items-center">
                <Package className="h-6 w-6 text-gray-400" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Total Packages</dt>
                    <dd className="text-lg font-medium text-gray-900">12</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <div className="flex items-center">
                <Send className="h-6 w-6 text-gray-400" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">In Transit</dt>
                    <dd className="text-lg font-medium text-gray-900">3</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-gray-400" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Pending</dt>
                    <dd className="text-lg font-medium text-gray-900">2</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <div className="flex items-center">
                <Search className="h-6 w-6 text-gray-400" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Available Carriers</dt>
                    <dd className="text-lg font-medium text-gray-900">8</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Packages */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Packages</h2>
              <button
                  onClick={() => navigate('/search-carrier')} // Navigate to SearchCarrier
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Send New Package
              </button>
            </div>
            {/* Table */}
            <div className="mt-4 flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Destination
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Weight
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                      {packages.map((pkg) => (
                          <tr key={pkg.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{pkg.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.destination}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${pkg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    pkg.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                                        'bg-green-100 text-green-800'}`}
                            >
                              {pkg.status}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.weight}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.date}</td>
                          </tr>
                      ))}
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
