const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please add a Category'],
      maxlength: [500, 'Category can not be more than 500 characters'],
    },
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);




 //Cascade delete episode when a show is deleted
 ShowSchema.pre('remove', async function (next) {
   console.log(`episode being removed from show ${this._id}`);
   await this.model('Episode').deleteMany({ show: this._id });
   next();
 });

// Reverse populate with virtuals
ShowSchema.virtual('episode', {
  ref: 'Episode',
  localField: '_id',
  foreignField: 'show',
  justOne: false,
});

module.exports = mongoose.model('Show', ShowSchema);
