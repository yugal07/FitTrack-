const express = require('express');
const router = express.Router();
const {
  getMeasurements,
  addMeasurement,
  updateMeasurement,
  deleteMeasurement,
  getProgressPhotos,
  uploadProgressPhoto,
  deleteProgressPhoto,
  getPhotoComparison,
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/measurements').get(getMeasurements).post(addMeasurement);

router
  .route('/measurements/:id')
  .put(updateMeasurement)
  .delete(deleteMeasurement);

router
  .route('/progress-photos')
  .get(getProgressPhotos)
  .post(uploadProgressPhoto);

router.route('/progress-photos/:id').delete(deleteProgressPhoto);

router.get('/progress-photos/comparison', getPhotoComparison);

module.exports = router;
