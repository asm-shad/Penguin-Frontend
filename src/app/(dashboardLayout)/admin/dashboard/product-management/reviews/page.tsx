import React from 'react';

const ProductReviewsPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-yellow-50 to-amber-100 p-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-gray-900">
            PRODUCT REVIEWS
          </h1>
          <p className="text-3xl font-bold text-gray-600">
            REVIEW MODERATION
          </p>
        </div>
        
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-3xl">⭐</span>
            <p className="text-xl font-semibold text-amber-700">
              Review Management System Under Development
            </p>
            <span className="text-3xl">⭐</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Planned Review Features:
          </h2>
          <ul className="text-gray-600 space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-center">
              <span className="mr-2">📝</span>
              Review moderation and approval
            </li>
            <li className="flex items-center">
              <span className="mr-2">⭐</span>
              Star rating analytics
            </li>
            <li className="flex items-center">
              <span className="mr-2">💬</span>
              Customer feedback analysis
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span>
              Spam detection and filtering
            </li>
            <li className="flex items-center">
              <span className="mr-2">📊</span>
              Review response management
            </li>
            <li className="flex items-center">
              <span className="mr-2">📈</span>
              Product rating trends
            </li>
            <li className="flex items-center">
              <span className="mr-2">🛡️</span>
              Review authenticity verification
            </li>
            <li className="flex items-center">
              <span className="mr-2">📱</span>
              Photo/video review management
            </li>
          </ul>
        </div>

        {/* Star rating preview */}
        <div className="flex items-center justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-2xl text-yellow-400">⭐</span>
          ))}
          <span className="ml-2 text-gray-600 font-medium">5.0 Average</span>
        </div>

        <p className="text-gray-400 text-sm italic">
          Development phase: Planning • Priority: Medium
        </p>
      </div>
    </div>
  );
};

export default ProductReviewsPage;