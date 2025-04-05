import React from "react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>

        <div className="flex flex-col md:flex-row justify-between gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center flex-1">
            <h3 className="text-xl font-semibold mb-4">1. Register</h3>
            <p className="text-gray-700">Sign up as a traveler or sender.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center flex-1">
            <h3 className="text-xl font-semibold mb-4">2. Connect</h3>
            <p className="text-gray-700">
              Find a traveler or sender that matches your needs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center flex-1">
            <h3 className="text-xl font-semibold mb-4">3. Deliver</h3>
            <p className="text-gray-700">
              Ensure fast and secure delivery to the destination.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
