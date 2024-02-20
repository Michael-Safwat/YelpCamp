const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 
const Campground = require('./models/campground');
const Review = require('./models/review');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { send } = require('process');
const {campgroundSchema, reviewSchema }=require('./schemas');
const campgroundsRoutes=require('./routers/campgrounds');

const app=express();
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db=mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",()=>{
  console.log("Database Connected");
});

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use('/campgrounds',campgroundsRoutes);


const validateReview=(req,res,next)=>{
  const {error}= reviewSchema.validate(req.body);
  console.log(error);
    if(error){
      const msg=error.details.map(el=>el.message).join(',');
      throw new ExpressError(msg,400);
    }  else{
      next(); 
    }
}

app.get('/',(req,res)=>{
  res.render('home');
})



app.post('/campgrounds/:id/reviews', validateReview ,catchAsync(async(req,res)=>{
  const campground=await Campground.findById(req.params.id);
  const review= new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
}))

app.all('*',(req,res,next)=>{
  next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
  const {statusCode=500}=err;
  if(!err.message)
  {
    err.message='Oops!!! Something Went Wrong';
  }
  res.status(statusCode).render('error',{err});
}) 

app.listen(3000,()=>{
  console.log('Serving on port 3000');
})