const  mongoose = require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');
const Campground=require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db=mongoose.connection;

db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",()=>{
  console.log("Database Connected");
});

const sample= arr =>arr[Math.floor(Math.random()*arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
      const random1000 = Math.floor(Math.random() * 1000);
      const price = Math.floor(Math.random() * 20) + 10;
      const camp = new Campground({
          author: '65d6492bfc7924b35583df5a',
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
          price,
          images:[
            {
              url: 'https://res.cloudinary.com/dcjy4nowp/image/upload/v1708699848/YelpCamp/rqt2a56dkg9jglwhiwdn.jpg',
              filename: 'YelpCamp/rqt2a56dkg9jglwhiwdn'
            },
            {
              url: 'https://res.cloudinary.com/dcjy4nowp/image/upload/v1708699848/YelpCamp/ckwj7ldjiuhnzibuhrin.jpg',
              filename: 'YelpCamp/ckwj7ldjiuhnzibuhrin'
            }
          ]
      })
      await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
})