const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path'); 
const ejsMate = require('ejs-mate');
const Campground = require('./models/campgrounds');


const app = express();
const AtlasUri = "mongodb://vs_code:xqM8cy2yJnt019Oi@blogapp-shard-00-00.snaf8.mongodb.net:27017,blogapp-shard-00-01.snaf8.mongodb.net:27017,blogapp-shard-00-02.snaf8.mongodb.net:27017/<dbname>?ssl=true&replicaSet=atlas-69qnok-shard-0&authSource=admin&retryWrites=true&w=majority"
mongoose.connect( AtlasUri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

app.engine('ejs',ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
	res.render('home', {title:'YelpCamp | Home'});
});

app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', {campgrounds: campgrounds, title: "All Campgrounds" });
});

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new', { title: 'Create New Campground'})
});

app.post('/campgrounds', async (req, res) => {
	const campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render('campgrounds/show', {campground: campground, title: campground.title });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render('campgrounds/edit', {campground: campground, title: `Edit | ${campground.title}`});
});

app.put('/campgrounds/:id', async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
	res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect('/campgrounds');
 });

app.listen( process.env.PORT || 3000, process.env.IP ,  () => {
	console.log('server has started listining')
});