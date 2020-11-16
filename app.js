const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 
const Campground = require('./models/campgrounds');


const app = express();
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.render('home')
});

app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', {campgrounds: campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new')
});

app.post('/campgrounds', async (req, res) => {
	const campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render('campgrounds/show', {campground: campground});
});


app.listen(3000, () => {
	console.log('server has started listining')
});