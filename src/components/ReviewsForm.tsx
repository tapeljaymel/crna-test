import React from 'react';

interface ReviewsFormProps {
  newReviewText: string;
  newReviewRating: number;
  setNewReviewText: (text: string) => void;
  setNewReviewRating: (rating: number) => void;
  onReviewSubmit: () => void;
}

const ReviewsForm: React.FC<ReviewsFormProps> = ({
  newReviewText,
  newReviewRating,
  setNewReviewText,
  setNewReviewRating,
  onReviewSubmit
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>
      <div className="flex items-center mb-2">
        <div className="flex space-x-1 text-yellow-500">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-6 h-6 cursor-pointer ${index < newReviewRating ? 'fill-current' : 'text-gray-300'}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              onClick={() => setNewReviewRating(index + 1)}
            >
              <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
            </svg>
          ))}
        </div>
      </div>
      <textarea
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        rows={4}
        value={newReviewText}
        onChange={(e) => setNewReviewText(e.target.value)}
      />
      <button
        type="button"
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
        onClick={onReviewSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default ReviewsForm;
