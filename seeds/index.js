const  mongoose = require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');
const Campgroud=require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db=mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",()=>{
  console.log("Database Connected");
});

const sample= arr =>arr[Math.floor(Math.random()*arr.length)];

const seedDB=async()=>{
  await Campgroud.deleteMany({});
  for(let i=0;i<50;i++)
  {
    const random1000=Math.floor(Math.random()*1001);
    const price=Math.floor(Math.random()*20+10);  
    const camp=new Campgroud({
      location:`${cities[random1000].city},${cities[random1000].state}`,
      title:`${sample(descriptors)} ${sample(places)}`,
      image:'https://source.unsplash.com/collection/483251',
      description:'  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa pariatur aut voluptatum vitae suscipit natus adipisci nisi sapiente velit at quas, repudiandae dolorum! Unde rem repellat quibusdam ullam quo aliquam.',
      price
    })
    await camp.save;
  }
}

seedDB().then(()=>{
  mongoose.connection.close();
})