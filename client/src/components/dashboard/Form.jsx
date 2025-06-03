import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useToast } from '../../contexts/ToastContext';

const Form = () => {
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Feedback is required';
    } else if (title.trim().length < 10) {
      newErrors.title = 'Feedback must be at least 10 characters long';
    }

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData = {
        title: title.trim(),
        rating,
      };

      console.log('Feedback submitted:', feedbackData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Thank you for your feedback!');

      // Reset form
      setTitle('');
      setRating(0);
      setErrors({});
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = selectedRating => {
    setRating(selectedRating);
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleTitleChange = e => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  const getRatingText = rating => {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Select a rating';
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <Card className='p-6 sm:p-8'>
        <div className='text-center mb-8'>
          <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Share Your Feedback
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Help us improve your FitTrack experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Rating Section */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
              How would you rate your experience?
            </label>

            <div className='flex flex-col items-center space-y-3'>
              <div className='flex space-x-1'>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type='button'
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={`p-1 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    <svg className='w-8 h-8 fill-current' viewBox='0 0 24 24'>
                      <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                    </svg>
                  </button>
                ))}
              </div>

              <div className='text-center'>
                <span
                  className={`text-sm font-medium ${
                    rating > 0
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {getRatingText(hoveredRating || rating)}
                </span>
                {rating > 0 && (
                  <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    {rating} out of 5 stars
                  </div>
                )}
              </div>
            </div>

            {errors.rating && (
              <p className='mt-2 text-sm text-red-600 dark:text-red-400 text-center'>
                {errors.rating}
              </p>
            )}
          </div>

          {/* Feedback Text Section */}
          <div>
            <label
              htmlFor='feedback'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
            >
              Tell us more about your experience
            </label>
            <div className='relative'>
              <textarea
                id='feedback'
                name='feedback'
                rows={4}
                value={title}
                onChange={handleTitleChange}
                placeholder='Share your thoughts, suggestions, or any issues you encountered...'
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors resize-none ${
                  errors.title
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isSubmitting}
              />
              <div className='absolute bottom-3 right-3 text-xs text-gray-400'>
                {title.length}/500
              </div>
            </div>
            {errors.title && (
              <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                {errors.title}
              </p>
            )}
            <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
              Minimum 10 characters required
            </p>
          </div>

          {/* Submit Button */}
          <div className='pt-4'>
            <Button
              type='submit'
              variant='primary'
              size='lg'
              className='w-full'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                    />
                  </svg>
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Additional Info */}
        <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-center text-sm text-gray-500 dark:text-gray-400'>
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
            Your feedback is anonymous and helps us improve
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Form;
