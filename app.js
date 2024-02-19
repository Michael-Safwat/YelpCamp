const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 
const Campgroud = require('./models/campground');
const Review = require('./models/review');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { send } = require('process');
const {campgroundSchema}=require('./schemas');


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

const validateCampground=(req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
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

app.get('/campgrounds',catchAsync(async(req,res)=>{
  const campgrounds=await Campgroud.find({});
  res.render('campgrounds/index',{campgrounds});
}))

app.get('/campgrounds/add',(req,res)=>{
  res.render('campgrounds/add');
})

app.post('/campgrounds',validateCampground,catchAsync(async(req,res,next)=>{
    const camp= new Campgroud(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.get('/campgrounds/:id',catchAsync(async(req,res)=>{
  const campground=await Campgroud.findById(req.params.id) ;
  res.render('campgrounds/details',{campground});
}))

app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
  const campground=await Campgroud.findById(req.params.id) ;
  res.render('campgrounds/edit',{campground});
}))

app.put('/campgrounds/:id',validateCampground,catchAsync(async(req,res)=>{
  const {id}=req.params;
  const campground= await Campgroud.findByIdAndUpdate(id,{...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
  const {id}=req.params;
  await Campgroud.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}))

app.post('/campgrounds/:id/reviews',catchAsync(async(req,res)=>{
  const campground=await Campgroud.findById(req.params.id);
  const review= new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
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