const express = require('express');
const {
  getEpisodes,
  getEpisode,
  addEpisode,
  updateEpisode,
  deleteEpisode,
} = require('../controllers/episode');

const Episode  = require('../models/Episode');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Episode , {
      path: 'show',
      select: 'name description',
    }),
    getEpisodes
  )
  .post(protect, authorize('publisher', 'admin'), addEpisode);
router
  .route('/:id')
  .get(getEpisode)
  .put(protect, authorize('publisher', 'admin'), updateEpisode)
  .delete(protect, authorize('publisher', 'admin'), deleteEpisode);

module.exports = router;
