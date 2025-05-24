import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../utils/api';
import Card from '../ui/Card';
import ConfirmModal from '../ui/ConfirmModal';
import PhotoForm from './PhotoForm';

const ProgressPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);

  // State for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    photoId: null,
    photoDate: '',
    loading: false,
  });

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
      setError('');
    } catch (err) {
      setError('Failed to load progress photos');
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async photoData => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', photoData.file);
      formData.append('category', photoData.category);
      formData.append('notes', photoData.notes || '');
      formData.append('date', photoData.date);

      await api.post('/api/uploads/progress-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Photo uploaded successfully');
      setShowForm(false);
      fetchPhotos();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to upload photo');
      console.error('Error uploading photo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = photo => {
    setDeleteConfirm({
      isOpen: true,
      photoId: photo._id,
      photoDate: format(new Date(photo.date), 'MMM d, yyyy'),
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteConfirm(prev => ({ ...prev, loading: true }));

    try {
      await api.delete(`/api/uploads/progress-photo/${deleteConfirm.photoId}`);

      setSuccess('Photo deleted successfully');
      fetchPhotos();

      setDeleteConfirm({
        isOpen: false,
        photoId: null,
        photoDate: '',
        loading: false,
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete photo');
      console.error('Error deleting photo:', err);
      setDeleteConfirm(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteCancel = () => {
    if (!deleteConfirm.loading) {
      setDeleteConfirm({
        isOpen: false,
        photoId: null,
        photoDate: '',
        loading: false,
      });
    }
  };

  const handleSelectPhoto = (photo, type) => {
    if (type === 'before') {
      setBeforePhoto(photo);
      if (!afterPhoto) {
        // Auto-select the newest photo if after is not selected
        const newerPhotos = photos.filter(
          p =>
            new Date(p.date) > new Date(photo.date) &&
            p.category === photo.category
        );
        if (newerPhotos.length > 0) {
          setAfterPhoto(newerPhotos[0]);
        }
      }
    } else {
      setAfterPhoto(photo);
      if (!beforePhoto) {
        // Auto-select the oldest photo if before is not selected
        const olderPhotos = photos.filter(
          p =>
            new Date(p.date) < new Date(photo.date) &&
            p.category === photo.category
        );
        if (olderPhotos.length > 0) {
          setBeforePhoto(olderPhotos[olderPhotos.length - 1]);
        }
      }
    }
  };

  const exitCompareMode = () => {
    setCompareMode(false);
    setBeforePhoto(null);
    setAfterPhoto(null);
  };

  // Filter photos by category
  const filteredPhotos =
    selectedCategory === 'all'
      ? photos
      : photos.filter(photo => photo.category === selectedCategory);

  // Group photos by month
  const groupedPhotos = filteredPhotos.reduce((groups, photo) => {
    const date = new Date(photo.date);
    const monthYear = format(date, 'MMMM yyyy');

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }

    groups[monthYear].push(photo);
    return groups;
  }, {});

  return (
    <Card
      title='Progress Photos'
      subtitle='Track your physical transformation over time'
    >
      {success && (
        <div className='mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg'>
          {success}
        </div>
      )}

      {error && (
        <div className='mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      <div className='flex flex-wrap justify-between items-center mb-6'>
        <div className='flex space-x-2 mb-3 sm:mb-0'>
          <button
            type='button'
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            All
          </button>
          <button
            type='button'
            onClick={() => setSelectedCategory('front')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedCategory === 'front'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Front
          </button>
          <button
            type='button'
            onClick={() => setSelectedCategory('side')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedCategory === 'side'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Side
          </button>
          <button
            type='button'
            onClick={() => setSelectedCategory('back')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedCategory === 'back'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Back
          </button>
        </div>

        <div className='flex space-x-2'>
          {!compareMode ? (
            <>
              <button
                type='button'
                onClick={() => setShowForm(true)}
                className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4v16m8-8H4'
                  />
                </svg>
                Add Photo
              </button>

              <button
                type='button'
                onClick={() => setCompareMode(true)}
                disabled={photos.length < 2}
                className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-2'
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
                Compare Photos
              </button>
            </>
          ) : (
            <button
              type='button'
              onClick={exitCompareMode}
              className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
            >
              Exit Compare Mode
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className='mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
            Upload Progress Photo
          </h3>
          <PhotoForm
            onSubmit={handlePhotoUpload}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        </div>
      )}

      {compareMode ? (
        <div className='my-4'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
            Before & After Comparison
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
              <div className='bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700'>
                <h4 className='font-medium text-gray-700 dark:text-gray-300'>
                  Before
                </h4>
              </div>

              {beforePhoto ? (
                <div className='relative'>
                  <img
                    src={beforePhoto.photoUrl}
                    alt='Before'
                    className='w-full h-auto'
                  />
                  <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm'>
                    {format(new Date(beforePhoto.date), 'MMM d, yyyy')}
                  </div>
                </div>
              ) : (
                <div className='h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'>
                  Select a "Before" photo
                </div>
              )}

              {!beforePhoto && photos.length > 0 && (
                <div className='p-4'>
                  <div className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Select a before photo:
                  </div>
                  <div className='grid grid-cols-3 gap-2'>
                    {photos.slice(0, 6).map(photo => (
                      <div
                        key={photo._id}
                        onClick={() => handleSelectPhoto(photo, 'before')}
                        className='cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-indigo-500'
                      >
                        <img
                          src={photo.photoUrl}
                          alt={format(new Date(photo.date), 'MMM d, yyyy')}
                          className='w-full h-auto'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
              <div className='bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700'>
                <h4 className='font-medium text-gray-700 dark:text-gray-300'>
                  After
                </h4>
              </div>

              {afterPhoto ? (
                <div className='relative'>
                  <img
                    src={afterPhoto.photoUrl}
                    alt='After'
                    className='w-full h-auto'
                  />
                  <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm'>
                    {format(new Date(afterPhoto.date), 'MMM d, yyyy')}
                  </div>
                </div>
              ) : (
                <div className='h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'>
                  Select an "After" photo
                </div>
              )}

              {!afterPhoto && photos.length > 0 && (
                <div className='p-4'>
                  <div className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Select an after photo:
                  </div>
                  <div className='grid grid-cols-3 gap-2'>
                    {photos.slice(0, 6).map(photo => (
                      <div
                        key={photo._id}
                        onClick={() => handleSelectPhoto(photo, 'after')}
                        className='cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-indigo-500'
                      >
                        <img
                          src={photo.photoUrl}
                          alt={format(new Date(photo.date), 'MMM d, yyyy')}
                          className='w-full h-auto'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {beforePhoto && afterPhoto && (
            <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
              <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                Comparison Details
              </h4>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                <span className='font-medium'>Time difference:</span>{' '}
                {formatTimeDifference(
                  new Date(beforePhoto.date),
                  new Date(afterPhoto.date)
                )}
              </p>
              {(beforePhoto.notes || afterPhoto.notes) && (
                <div className='mt-2'>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    <span className='font-medium'>Before notes:</span>{' '}
                    {beforePhoto.notes || 'None'}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    <span className='font-medium'>After notes:</span>{' '}
                    {afterPhoto.notes || 'None'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : loading && photos.length === 0 ? (
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
          <p className='mt-3 text-sm text-gray-600 dark:text-gray-400'>
            Loading photos...
          </p>
        </div>
      ) : photos.length === 0 ? (
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
            No progress photos yet
          </h3>
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            Start tracking your fitness journey by adding your first progress
            photo.
          </p>
          <button
            type='button'
            onClick={() => setShowForm(true)}
            className='mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-2'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 4v16m8-8H4'
              />
            </svg>
            Add First Photo
          </button>
        </div>
      ) : (
        <div>
          {Object.keys(groupedPhotos).map(monthYear => (
            <div key={monthYear} className='mb-8'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2'>
                {monthYear}
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {groupedPhotos[monthYear].map(photo => (
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
                      <button
                        onClick={() => handleDeleteClick(photo)}
                        className='bg-red-600 text-white p-2 rounded-full hover:bg-red-700'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
                      </button>
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
                        <p className='text-xs mt-1 line-clamp-1'>
                          {photo.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title='Delete Progress Photo'
        message={`Are you sure you want to delete the progress photo from ${deleteConfirm.photoDate}? This action cannot be undone and will permanently remove this photo from your progress tracking.`}
        confirmText='Delete Photo'
        cancelText='Cancel'
        variant='danger'
        loading={deleteConfirm.loading}
      />
    </Card>
  );
};

// Helper function to format time difference
const formatTimeDifference = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return `${diffDays} days`;
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

export default ProgressPhotos;
