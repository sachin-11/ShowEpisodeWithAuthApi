const express = require('express');
const {
  createShow,
  getShow,
  getShows,
  updateshow,
  deleteShow,
  showPhotoUpload
} = require('../controllers/show');

const Show = require('../models/Show');
const advancedResults = require('../middleware/advancedResults');

//include other resource router

const episodeRouter = require('./episode');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

//Re-route into other resouces router

router.use('/:showId/episode', episodeRouter);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), showPhotoUpload);

router
  .route('/')
  .get(advancedResults(Show, 'episode'), getShows)
  .post(protect, authorize('publisher', 'admin'), createShow);

router
  .route('/:id')
  .get(getShow)
  .put(protect, authorize('publisher', 'admin'), updateshow)
  .delete(protect, authorize('publisher', 'admin'), deleteShow);

module.exports = router;
