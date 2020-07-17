const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');
const Show = require('../models/Show');

//desc  GET all shows
//@route GET /api/v1/shows
//@access Public

exports.getShows = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//desc  GET Single shows
//@route GET /api/v1/show/:id
//@access Public

exports.getShow = asyncHandler(async (req, res, next) => {
  const show = await Show.findById(req.params.id);
  if (!show) {
    return next(
      new ErrorResponse(`Show not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: show });
});

//desc  create  new show
//@route POST /api/v1/show
//@access Private

exports.createShow = asyncHandler(async (req, res, next) => {
  //Add user to req.body
  req.body.user = req.user.id;
  //Check for published show
  const publishedShow = await Show.findOne({ user: req.user.id });
  //if user is not an admin , they can add one show
  if (publishedShow && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} has already publish show`,
        400
      )
    );
  }
  const show = await Show.create(req.body);
  res.status(200).json({ success: true, data: show });
});

//desc  update show
//@route GET /api/v1/show/:id
//@access Private

exports.updateshow = asyncHandler(async (req, res, next) => {
  let show = await Show.findById(req.params.id);
  if (!show) {
    return next(
      new ErrorResponse(`show not found with id of ${req.params.id}`, 404)
    );
  }
  //Make sure user is show owner
  if (show.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update show`,
        401
      )
    );
  }

  show = await Show.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: show });
});

//desc  delete show
//@route GET /api/v1/show/:id
//@access Private

exports.deleteShow = asyncHandler(async (req, res, next) => {
  const show = await Show.findById(req.params.id);
  if (!show) {
    return next(
      new ErrorResponse(`Show not found with id of ${req.params.id}`, 404)
    );
  }

  //Make sure user is show owner
  if (show.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this show`,
        401
      )
    );
  }
  show.remove();
  res.status(200).json({ success: true, data: {} });
});


// desc  Upload photo for show
// @route PUT  /api/v1/show/:id/photo
// @access Private

exports.showPhotoUpload = asyncHandler(async (req, res, next) => {
  const show = await Show.findById(req.params.id);

  if (!show) {
    return next(
      new ErrorResponse(`Show not found with id of ${req.params.id}`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${show._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Show.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

