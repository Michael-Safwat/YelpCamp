const mongoose=require('mongoose');
const Review = require('./review')
const schema =mongoose.Schema;

const ImageSchema = new schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
      type: schema.Types.ObjectId,
      ref: 'User'
  },
  reviews: [
      {
          type: schema.Types.ObjectId,
          ref: 'Review'
      }
  ]
});

campgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
      await Review.deleteMany({
          _id: {
              $in: doc.reviews
          }
      })
  }
})

module.exports=mongoose.model('campground',campgroundSchema);