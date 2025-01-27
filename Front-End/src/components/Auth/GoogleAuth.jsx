import React from 'react';

export const GoogleAuth = () => {
  const handleGoogleSignIn = () => {
    // Implement Google Sign In logic here
    console.log('Google Sign In clicked');
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <img
        className="h-5 w-5 mr-2"
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
      />
      Continue with Google
    </button>
  );
};