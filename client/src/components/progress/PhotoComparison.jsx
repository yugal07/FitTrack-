import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
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

  // Get available photos for comparison selection
  const getAvailablePhotos = (excludePhoto = null) => {
    const availablePhotos =
      selectedCategory === 'all'
        ? photos
        : photos.filter(photo => photo.category === selectedCategory);

    return excludePhoto
      ? availablePhotos.filter(photo => photo._id !== excludePhoto._id)
      : availablePhotos;
  };

  const formatTimeDifference = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);

      if (remainingMonths === 0) {
        return `${years} ${years === 1 ? 'year' : 'years'}`;
      } else {
        return `${years} ${years === 1 ? 'year' : 'years'} and ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
      }
    }
  };

  return (
    <Card
      title='Photo Comparison'
      subtitle='Compare your progress photos over time'
    >
      <div className='flex flex-wrap gap-2 mb-6'>
        <button
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          onClick={() => handleCategoryChange('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedCategory === 'front'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          onClick={() => handleCategoryChange('front')}
        >
          Front
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedCategory === 'side'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          onClick={() => handleCategoryChange('side')}
        >
          Side
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedCategory === 'back'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          onClick={() => handleCategoryChange('back')}
        >
          Back
        </button>
      </div>

      {loading ? (
        <div className='text-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
          <p className='mt-4 text-sm text-gray-600 dark:text-gray-400'>
            Loading photos...
          </p>
        </div>
      ) : error ? (
        <div className='mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg'>
          {error}
        </div>
      ) : photos.length < 2 ? (
        <div className='text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
          <div className='mx-auto w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
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
          <h3 className='mt-4 text-lg font-medium text-gray-900 dark:text-white'>
            Not enough photos for comparison
          </h3>
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            You need at least two progress photos to make a comparison. Add more
            photos to get started.
          </p>
          <Button
            variant='primary'
            onClick={() => (window.location.href = '/profile#photos')}
            className='mt-6'
          >
            Add Progress Photos
          </Button>
        </div>
      ) : (
        <div>
          {/* Main Comparison View */}
          <div className='mb-8'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-6'>
              Before & After Comparison
            </h3>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Before Photo Section */}
              <div className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
                <div className='bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
                  <h4 className='font-medium text-gray-700 dark:text-gray-300'>
                    Before
                  </h4>
                </div>

                <div className='h-96 flex flex-col'>
                  {beforePhoto ? (
                    <div className='relative h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700'>
                      <img
                        src={beforePhoto.photoUrl}
                        alt='Before'
                        className='max-h-full max-w-full object-contain'
                      />
                      <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-3'>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm font-medium'>
                            {format(new Date(beforePhoto.date), 'MMM d, yyyy')}
                          </span>
                          <span className='text-xs px-2 py-1 bg-gray-800 rounded-full capitalize'>
                            {beforePhoto.category}
                          </span>
                        </div>
                        {beforePhoto.notes && (
                          <p className='text-xs mt-1 opacity-90 truncate'>
                            {beforePhoto.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setBeforePhoto(null)}
                        className='absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors'
                      >
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className='h-full flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'>
                      <div className='text-center'>
                        <svg
                          className='mx-auto h-12 w-12 text-gray-400 mb-3'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-4-2v6m-6-6v6'
                          />
                        </svg>
                        <p className='text-sm'>Select a "Before" photo</p>
                      </div>
                    </div>
                  )}
                </div>

                {!beforePhoto && getAvailablePhotos(afterPhoto).length > 0 && (
                  <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                    <div className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                      Select a before photo:
                    </div>
                    <div className='grid grid-cols-3 gap-2 max-h-32 overflow-y-auto'>
                      {getAvailablePhotos(afterPhoto).map(photo => (
                        <div
                          key={photo._id}
                          onClick={() => handlePhotoSelect(photo, 'before')}
                          className='cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all transform hover:scale-105'
                        >
                          <img
                            src={photo.photoUrl}
                            alt={format(new Date(photo.date), 'MMM d, yyyy')}
                            className='w-full h-14 object-cover'
                          />
                          <div className='text-xs text-center py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'>
                            {format(new Date(photo.date), 'MMM d')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* After Photo Section */}
              <div className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
                <div className='bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
                  <h4 className='font-medium text-gray-700 dark:text-gray-300'>
                    After
                  </h4>
                </div>

                <div className='h-96 flex flex-col'>
                  {afterPhoto ? (
                    <div className='relative h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700'>
                      <img
                        src={afterPhoto.photoUrl}
                        alt='After'
                        className='max-h-full max-w-full object-contain'
                      />
                      <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-3'>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm font-medium'>
                            {format(new Date(afterPhoto.date), 'MMM d, yyyy')}
                          </span>
                          <span className='text-xs px-2 py-1 bg-gray-800 rounded-full capitalize'>
                            {afterPhoto.category}
                          </span>
                        </div>
                        {afterPhoto.notes && (
                          <p className='text-xs mt-1 opacity-90 truncate'>
                            {afterPhoto.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setAfterPhoto(null)}
                        className='absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors'
                      >
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className='h-full flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'>
                      <div className='text-center'>
                        <svg
                          className='mx-auto h-12 w-12 text-gray-400 mb-3'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-4-2v6m-6-6v6'
                          />
                        </svg>
                        <p className='text-sm'>Select an "After" photo</p>
                      </div>
                    </div>
                  )}
                </div>

                {!afterPhoto && getAvailablePhotos(beforePhoto).length > 0 && (
                  <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                    <div className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                      Select an after photo:
                    </div>
                    <div className='grid grid-cols-3 gap-2 max-h-32 overflow-y-auto'>
                      {getAvailablePhotos(beforePhoto).map(photo => (
                        <div
                          key={photo._id}
                          onClick={() => handlePhotoSelect(photo, 'after')}
                          className='cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all transform hover:scale-105'
                        >
                          <img
                            src={photo.photoUrl}
                            alt={format(new Date(photo.date), 'MMM d, yyyy')}
                            className='w-full h-14 object-cover'
                          />
                          <div className='text-xs text-center py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'>
                            {format(new Date(photo.date), 'MMM d')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {beforePhoto && afterPhoto && (
              <div className='mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                <h4 className='font-medium text-gray-900 dark:text-white mb-3'>
                  Comparison Details
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300'>
                  <div>
                    <span className='font-medium'>Time difference:</span>{' '}
                    {formatTimeDifference(
                      new Date(beforePhoto.date),
                      new Date(afterPhoto.date)
                    )}
                  </div>
                  <div>
                    <span className='font-medium'>Categories:</span>{' '}
                    {beforePhoto.category} → {afterPhoto.category}
                  </div>
                </div>
                {(beforePhoto.notes || afterPhoto.notes) && (
                  <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300'>
                      <div>
                        <span className='font-medium'>Before notes:</span>{' '}
                        {beforePhoto.notes || 'None'}
                      </div>
                      <div>
                        <span className='font-medium'>After notes:</span>{' '}
                        {afterPhoto.notes || 'None'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Photo Timeline Grid */}
          <div className='mt-8'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2'>
              Photo Timeline
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {filteredPhotos.map(photo => (
                <div
                  key={photo._id}
                  className='relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden group'
                >
                  <img
                    src={photo.photoUrl}
                    alt={`Progress photo from ${format(new Date(photo.date), 'MMM d, yyyy')}`}
                    className='w-full h-64 object-cover'
                  />
                  <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100'>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => handlePhotoSelect(photo, 'before')}
                        className='bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors'
                      >
                        Before
                      </button>
                      <button
                        onClick={() => handlePhotoSelect(photo, 'after')}
                        className='bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors'
                      >
                        After
                      </button>
                    </div>
                  </div>
                  <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm'>
                        {format(new Date(photo.date), 'MMM d, yyyy')}
                      </span>
                      <span className='text-xs px-2 py-1 bg-gray-800 rounded-full capitalize'>
                        {photo.category}
                      </span>
                    </div>
                    {photo.notes && (
                      <p className='text-xs mt-1 line-clamp-1'>{photo.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-8 text-center'>
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
