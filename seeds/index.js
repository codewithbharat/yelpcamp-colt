
const mongoose = require('mongoose');
const {places, descriptors} = require('./seedsHelper');
const Campground = require('../models/campgrounds');
const cities = require('./cities');

const AtlasUri = "mongodb://vs_code:xqM8cy2yJnt019Oi@blogapp-shard-00-00.snaf8.mongodb.net:27017,blogapp-shard-00-01.snaf8.mongodb.net:27017,blogapp-shard-00-02.snaf8.mongodb.net:27017/<dbname>?ssl=true&replicaSet=atlas-69qnok-shard-0&authSource=admin&retryWrites=true&w=majority"
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

		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(places)} ${sample(descriptors)}`,
			image: 'https://source.unsplash.com/collection/429524/',
			description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati placeat consequatur, repellat quas, enim voluptate adipisci assumenda necessitatibus maxime voluptates velit iure, cupiditate perspiciatis omnis et blanditiis voluptas expedita. Aliquid blanditiis culpa fugit nisi. Nostrum, illum. Sunt a, magnam obcaecati ratione dolor ullam dolores similique, quaerat delectus doloremque tempora quasi!',
			price,
		});
		await camp.save();
	}
}

seedDB().then( () => {
	mongoose.connection.close()
});