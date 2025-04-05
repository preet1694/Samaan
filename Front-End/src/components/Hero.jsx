import React from "react";
import { Package, Globe, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import deliveryGIF from "../assets/delivery-1836.gif";
export const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <div className=" max-w-7xl mx-auto">
        <div className=" relative z-10 pb-8 bg-white rounded-sm sm:pb-0 md:pb-0 lg:w-full lg:pb-0 xl:pb-0">
          <main className="mt-10 mx-auto max-w-7xl pt-0 px-4 sm:mt-0 sm:px-6 md:mt-0 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="lg:flex lg:items-center lg:justify-between">
              
              <div className="lg:w-1/2">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Ship your packages with</span>
                  <span className="block text-indigo-600">
                    trusted travelers
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Connect with travelers heading to your destination. Save money
                  and time by utilizing their extra luggage space.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/search-carrier"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Find a Carrier
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      Become a Carrier
                    </Link>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block lg:w-1/2 lg:pl-12">
                <img
                  src={deliveryGIF}
                  alt="Package Delivery Animation"
                  className="w-full h-auto rounded-md"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
