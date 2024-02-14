const express=require('express');
const  mongoose = require('mongoose');
const path=require('path'); 
const Campgroud=require('./models/campground');
const methodOverride=require('method-override');
const ejsMate= require('ejs-mate');

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

app.get('/',(req,res)=>{
  res.render('home');
})

app.get('/campgrounds',async(req,res)=>{
  const campgrounds=await Campgroud.find({});
  res.render('campgrounds/index',{campgrounds});
})

app.get('/campgrounds/add',(req,res)=>{
  res.render('campgrounds/add');
})

app.post('/campgrounds',async(req,res)=>{
  const camp= new Campgroud(req.body.campground);
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
})

app.get('/campgrounds/:id',async(req,res)=>{
  const campground=await Campgroud.findById(req.params.id) ;
  res.render('campgrounds/details',{campground});
})

app.get('/campgrounds/:id/edit',async(req,res)=>{
  const campground=await Campgroud.findById(req.params.id) ;
  res.render('campgrounds/edit',{campground});
})

app.put('/campgrounds/:id',async(req,res)=>{
  const {id}=req.params;
  const campground= await Campgroud.findByIdAndUpdate(id,{...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id',async(req,res)=>{
  const {id}=req.params;
  await Campgroud.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})

app.listen(3000,()=>{
  console.log('Serving on port 3000');
})