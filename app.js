const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { send } = require('process');
const campgroundsRoutes=require('./routers/campgrounds');
const reviewsRoutes=require('./routers/reviews');

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
app.use('/campgrounds/:id/reviews',reviewsRoutes);

app.get('/',(req,res)=>{
  res.render('home');
})

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