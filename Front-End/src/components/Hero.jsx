import React from 'react';
import { Package, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <div className=" max-w-7xl mx-auto">
        <div className=" relative z-10 pb-8 bg-white rounded-sm sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <main className=" mt-10 mx-auto max-w-7xl pt-10 px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Ship your packages with</span>
                <span className="block text-indigo-600">trusted travelers</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Connect with travelers heading to your destination. Save money and time by utilizing their extra luggage space.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/search-carrier" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                    Find a Carrier
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                    Become a Carrier
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};