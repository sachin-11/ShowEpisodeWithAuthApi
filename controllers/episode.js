const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Show = require('../models/Show');
const Episode = require('../models/Episode');

//@desc Get Episode from
//@route GET /api/v1/episode
//@route GET /api/v1/show/:showId/episode
//@access public

exports.getEpisodes = asyncHandler(async (req, res, next) => {
  if (req.params.showId) {
    const episode = await Episode.find({ show: req.params.showId });
    return res.status(200).json({
      success: true,
      count: episode.length,
      data: episode,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc Get single episode
//@route GET /api/v1/episode/:id
//@access public

exports.getEpisode = asyncHandler(async (req, res, next) => {
  const episode = await Episode.findById(req.params.id).populate({
    path: 'show',
    select: 'name description',
  });

  if (!episode) {
    return next(new ErrorResponse(`No episode with id ${req.params.id}`), 404);
  }

  res.status(200).json({ success: true, count: episode.length, data: episode });
});

//@desc Add episode
//@route POST /api/v1/show/:showId/episode
//@access Private

exports.addEpisode = asyncHandler(async (req, res, next) => {
  req.body.show = req.params.showId;
  req.body.user = req.user.id;
  const show = await Show.findById(req.params.showId);

  if (!show) {
    return next(
      new ErrorResponse(`No show with id ${req.params.showId}`),
      404
    );
  }
  //Make sure user is show owner
  if (show.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a episode to the show ${show._id}`,
        401
      )
    );
  }

  const episode = await Episode.create(req.body);

  res.status(200).json({ success: true, count: episode.length, data: episode });
});

//@desc Update Episode
//@route PUT  /api/v1/episode/:id
//@access Private

exports.updateEpisode = asyncHandler(async (req, res, next) => {
  let episode = await Episode.findById(req.params.id);

  if (!episode) {
    return next(new ErrorResponse(`No episode with id ${req.params.id}`), 404);
  }

  //Make sure user is show owner
  if (episode.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to Update episode  ${episode._id}`,
        401
      )
    );
  }

  episode = await Episode.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, count: episode.length, data: episode });
});

//@desc Delete course
//@route DELETE  /api/v1/courses/:id
//@access Private

exports.deleteEpisode = asyncHandler(async (req, res, next) => {
  const episode = await Episode.findById(req.params.id);

  if (!episode) {
    return next(new ErrorResponse(`No episode with id ${req.params.id}`), 404);
  }

  //Make sure user is episode owner
  if (episode.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete episode  ${episode._id}`,
        401
      )
    );
  }

  await episode.remove();

  res.status(200).json({ success: true, count: episode.length, data: {} });
});
