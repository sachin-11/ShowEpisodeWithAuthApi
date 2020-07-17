const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a episode title'],
  },
  introduction: {
    type: String,
    required: [true, 'Please add a introduction'],
  },
  videoURL: {
    type: String,
    retquired: [true, 'Please add link off videoURL']
  },
  show: {
    type: mongoose.Schema.ObjectId,
    ref: 'Show',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});



module.exports = mongoose.model('Episode', EpisodeSchema);
