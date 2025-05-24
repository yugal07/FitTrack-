import React, { useState, useEffect, useRef } from 'react';
import {
  format,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
} from 'date-fns';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../utils/api';

const PhotoComparison = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const beforeImgRef = useRef(null);
  const afterImgRef = useRef(null);
  const comparisonRef = useRef(null);
  const sliderRef = useRef(null);

  // Initialize the slider for comparison
  useEffect(() => {
    if (
      beforePhoto &&
      afterPhoto &&
      beforeImgRef.current &&
      afterImgRef.current &&
      comparisonRef.current &&
      sliderRef.current
    ) {
      initComparison();
    }
  }, [beforePhoto, afterPhoto]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/profiles/progress-photos');

      // Sort photos by date (newest first)
      const sortedPhotos = response.data.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setPhotos(sortedPhotos);

      // If there are at least 2 photos, preselect the first and last ones
      if (sortedPhotos.length >= 2) {
        if (selectedCategory !== 'all') {
          const categoryPhotos = sortedPhotos.filter(
            p => p.category === selectedCategory
          );
          if (categoryPhotos.length >= 2) {
            setBeforePhoto(categoryPhotos[categoryPhotos.length - 1]);
            setAfterPhoto(categoryPhotos[0]);
          }
        } else {
          setBeforePhoto(sortedPhotos[sortedPhotos.length - 1]);
          setAfterPhoto(sortedPhotos[0]);
        }
      }

      setError('');
    } catch (err) {
      setError('Failed to load progress photos');
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = category => {
    setSelectedCategory(category);

    // Reset selected photos
    setBeforePhoto(null);
    setAfterPhoto(null);

    // Attempt to select first and last photos of the category
    if (category === 'all') {
      if (photos.length >= 2) {
        setBeforePhoto(photos[photos.length - 1]);
        setAfterPhoto(photos[0]);
      }
    } else {
      const categoryPhotos = photos.filter(p => p.category === category);
      if (categoryPhotos.length >= 2) {
        setBeforePhoto(categoryPhotos[categoryPhotos.length - 1]);
        setAfterPhoto(categoryPhotos[0]);
      }
    }
  };

  const handlePhotoSelect = (photo, type) => {
    if (type === 'before') {
      setBeforePhoto(photo);
    } else {
      setAfterPhoto(photo);
    }
  };

  const filteredPhotos =
    selectedCategory === 'all'
      ? photos
      : photos.filter(photo => photo.category === selectedCategory);

  const formatTimeDifference = (date1, date2) => {
    const days = differenceInDays(date2, date1);

    if (days < 7) {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (days < 30) {
      const weeks = differenceInWeeks(date2, date1);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    } else {
      const months = differenceInMonths(date2, date1);
      const remainingDays = days - months * 30;

      if (remainingDays < 7) {
        return `${months} ${months === 1 ? 'month' : 'months'}`;
      } else {
        const weeks = Math.floor(remainingDays / 7);
        return `${months} ${months === 1 ? 'month' : 'months'} and ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
      }
    }
  };

  // Initialize the slider comparison functionality
  const initComparison = () => {
    const comparison = comparisonRef.current;
    const slider = sliderRef.current;

    const handleSlide = e => {
      const position = getCursorPosition(e);
      const container = comparison.getBoundingClientRect();
      const containerWidth = container.width;

      let percentage = (position / containerWidth) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      slider.style.left = `${percentage}%`;
      beforeImgRef.current.style.width = `${percentage}%`;
    };

    const getCursorPosition = e => {
      // Check if touch or mouse event
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const container = comparison.getBoundingClientRect();
      return x - container.left;
    };

    comparison.addEventListener('mousemove', handleSlide);
    comparison.addEventListener('touchmove', handleSlide);

    // Cleanup
    return () => {
      comparison.removeEventListener('mousemove', handleSlide);
      comparison.removeEventListener('touchmove', handleSlide);
    };
  };

  return (
    <Card
      title='Photo Comparison'
      subtitle='Compare your progress photos over time'
    >
      <div className='flex flex-wrap gap-2 mb-6'>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          onClick={() => handleCategoryChange('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            selectedCategory === 'front'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          onClick={() => handleCategoryChange('front')}
        >
          Front
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            selectedCategory === 'side'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          onClick={() => handleCategoryChange('side')}
        >
          Side
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            selectedCategory === 'back'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          onClick={() => handleCategoryChange('back')}
        >
          Back
        </button>
      </div>

      {loading ? (
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
          <p className='mt-3 text-sm text-gray-600 dark:text-gray-400'>
            Loading photos...
          </p>
        </div>
      ) : error ? (
        <div className='p-4 text-red-500 dark:text-red-400 text-center'>
          {error}
        </div>
      ) : photos.length < 2 ? (
        <div className='text-center py-10'>
          <div className='mx-auto w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-12 w-12 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
            Not enough photos for comparison
          </h3>
          <p className='text-gray-500 dark:text-gray-400 mb-4'>
            You need at least two progress photos to make a comparison. Add more
            photos to get started.
          </p>
          <Button
            variant='primary'
            onClick={() => (window.location.href = '/profile#photos')}
          >
            Add Progress Photos
          </Button>
        </div>
      ) : (
        <div>
          {/* Main Comparison View */}
          <div className='mb-8'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
              Before & After Comparison
            </h3>

            {beforePhoto && afterPhoto ? (
              <div className='space-y-4'>
                {/* Slider comparison */}
                <div
                  ref={comparisonRef}
                  className='relative w-full h-96 overflow-hidden cursor-col-resize rounded-lg border border-gray-200 dark:border-gray-700'
                >
                  {/* Before image (left side) */}
                  <div
                    ref={beforeImgRef}
                    className='absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white'
                    style={{ width: '50%' }}
                  >
                    <img
                      src={beforePhoto.photoUrl}
                      alt='Before'
                      className='h-full w-full object-cover'
                    />
                    <div className='absolute top-4 left-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm'>
                      {format(new Date(beforePhoto.date), 'MMM d, yyyy')}
                    </div>
                  </div>

                  {/* After image (right side) */}
                  <div className='absolute top-0 right-0 h-full w-full overflow-hidden'>
                    <img
                      ref={afterImgRef}
                      src={afterPhoto.photoUrl}
                      alt='After'
                      className='h-full w-full object-cover'
                    />
                    <div className='absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm'>
                      {format(new Date(afterPhoto.date), 'MMM d, yyyy')}
                    </div>
                  </div>

                  {/* Slider handle */}
                  <div
                    ref={sliderRef}
                    className='absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize'
                    style={{ left: '50%' }}
                  >
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-lg'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6 text-gray-600'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Comparison details */}
                <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                    Comparison Details
                  </h4>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        <span className='font-medium'>Time difference:</span>{' '}
                        {formatTimeDifference(
                          new Date(beforePhoto.date),
                          new Date(afterPhoto.date)
                        )}
                      </p>

                      <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                        <span className='font-medium'>Category:</span>{' '}
                        {beforePhoto.category.charAt(0).toUpperCase() +
                          beforePhoto.category.slice(1)}
                      </p>
                    </div>

                    <div className='space-y-2'>
                      {beforePhoto.notes && (
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          <span className='font-medium'>Before notes:</span>{' '}
                          {beforePhoto.notes}
                        </p>
                      )}

                      {afterPhoto.notes && (
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          <span className='font-medium'>After notes:</span>{' '}
                          {afterPhoto.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex flex-col md:flex-row gap-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                {/* Before photo selection */}
                <div className='md:w-1/2'>
                  <h4 className='text-base font-medium text-gray-800 dark:text-gray-200 mb-3'>
                    Select Before Photo
                  </h4>
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    {filteredPhotos
                      .slice()
                      .reverse()
                      .map(photo => (
                        <div
                          key={`before-${photo._id}`}
                          onClick={() => handlePhotoSelect(photo, 'before')}
                          className={`cursor-pointer rounded-md overflow-hidden border-2 transition ${
                            beforePhoto && beforePhoto._id === photo._id
                              ? 'border-indigo-500 shadow-md'
                              : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className='relative'>
                            <img
                              src={photo.photoUrl}
                              alt={format(new Date(photo.date), 'MMM d, yyyy')}
                              className='w-full h-24 object-cover'
                            />
                            <div className='absolute bottom-0 inset-x-0 bg-black bg-opacity-70 text-white text-xs py-1 px-2'>
                              {format(new Date(photo.date), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* After photo selection */}
                <div className='md:w-1/2 mt-6 md:mt-0'>
                  <h4 className='text-base font-medium text-gray-800 dark:text-gray-200 mb-3'>
                    Select After Photo
                  </h4>
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    {filteredPhotos.map(photo => (
                      <div
                        key={`after-${photo._id}`}
                        onClick={() => handlePhotoSelect(photo, 'after')}
                        className={`cursor-pointer rounded-md overflow-hidden border-2 transition ${
                          afterPhoto && afterPhoto._id === photo._id
                            ? 'border-indigo-500 shadow-md'
                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className='relative'>
                          <img
                            src={photo.photoUrl}
                            alt={format(new Date(photo.date), 'MMM d, yyyy')}
                            className='w-full h-24 object-cover'
                          />
                          <div className='absolute bottom-0 inset-x-0 bg-black bg-opacity-70 text-white text-xs py-1 px-2'>
                            {format(new Date(photo.date), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Photo gallery grid */}
          <div className='mt-8'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
              Photo Timeline
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {filteredPhotos.map(photo => (
                <div
                  key={photo._id}
                  className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'
                >
                  <div className='relative'>
                    <img
                      src={photo.photoUrl}
                      alt={`Progress photo from ${format(new Date(photo.date), 'MMM d, yyyy')}`}
                      className='w-full h-48 object-cover'
                    />
                    <div className='absolute top-0 inset-x-0 bg-gradient-to-b from-black/70 to-transparent p-2'>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm text-white font-medium'>
                          {format(new Date(photo.date), 'MMM d, yyyy')}
                        </span>
                        <span className='bg-black/50 text-white text-xs px-2 py-1 rounded-full capitalize'>
                          {photo.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='p-3'>
                    <div className='flex justify-between gap-2'>
                      <button
                        onClick={() => handlePhotoSelect(photo, 'before')}
                        className='flex-1 px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      >
                        Use as Before
                      </button>
                      <button
                        onClick={() => handlePhotoSelect(photo, 'after')}
                        className='flex-1 px-2 py-1 text-xs font-medium rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800'
                      >
                        Use as After
                      </button>
                    </div>

                    {photo.notes && (
                      <p className='mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2'>
                        {photo.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-6 text-center'>
            <Button
              variant='primary'
              onClick={() => (window.location.href = '/profile#photos')}
            >
              Add New Progress Photo
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PhotoComparison;
