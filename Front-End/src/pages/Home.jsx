import React from "react";
import { Package, Globe, Shield, Clock, Image } from "lucide-react";
import boxGIF from "../assets/box.gif";

export const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <img src={boxGIF} className="w-32 h-32 mx-auto lg:mx-0" />
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
                    <a
                      href="/search-carrier"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Find a Carrier
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      Become a Carrier
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <img
        src={boxGif}
        alt="Moving Box"
        className="w-32 h-32 mx-auto lg:mx-0"
      />
      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to ship your packages
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Global Network
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Connect with travelers worldwide and find the perfect
                    carrier for your package.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Secure Shipping
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our escrow system ensures your package and payment are
                    protected throughout the journey.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Fast Delivery
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Leverage existing travel plans for quick and efficient
                    package delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
