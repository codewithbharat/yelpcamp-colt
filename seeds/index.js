
const mongoose = require('mongoose');
const {places, descriptors} = require('./seedsHelper');
const Campground = require('../models/campgrounds');
const cities = require('./cities');

const AtlasUri = "mongodb+srv://bharat:8kxG7adWMxJbq59S@blogapp.snaf8.mongodb.net/<dbname>?retryWrites=true&w=majority"
mongoose.connect( AtlasUri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});



const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++){
		const random1000 = Math.floor(Math.random() * 1000);
		
		const sample = a => a[Math.floor(Math.random() * a.length)]
	
		
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(places)} ${sample(descriptors)}`,
			
		});
		await camp.save();
	}
}

seedDB().then( () => {
	mongoose.connection.close()
});