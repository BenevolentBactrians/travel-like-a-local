var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var utilities = require('./lib/util.js');
var path = require('path');


var app = express();
// set views to look in the public directory
app.set('views', path.join(__dirname, 'public'));
// set app view engine html to render ejs files
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('secret'));
app.use(session({
  key: 'secret',
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  next();
});


var staticRouter = express.Router();
staticRouter.get('/', function(req, res){
  var username = 'not logged in';
  if (req.session.user){
    username = req.session.user;
    res.render('index', {data:username});
  } else {
    res.render('landing')
  }

});
staticRouter.get('/explore', (req, res) => {
  res.redirect('/')
})
staticRouter.get('/trips', (req, res) => {
  res.redirect('/')
})
staticRouter.get('/suggestions', (req, res) => {
  res.redirect('/')
})
staticRouter.get('/friends', (req, res) => {
  res.redirect('/')
})
staticRouter.get('/index.html', utilities.checkUser);
staticRouter.get('/login', function(req, res){
  res.redirect('login.html');
});
staticRouter.post('/login', utilities.handleLogin);

staticRouter.get('/signup', function(req, res){
  res.redirect('signup.html');
});
staticRouter.post('/signup', utilities.handleSignup);
staticRouter.get('/logout', function(req, res){
  req.session.destroy(function() {
    var username = 'not logged in';
    res.redirect('/');
  });
});
app.use(staticRouter);
app.use(express.static(__dirname + '/public'));


var apiRouter = express.Router();
//path to show drop down of remaining friends, but it shows all users  except for the logged in user
// work to do here is to only show users that have not been added as friends in the dropdown
apiRouter.get('/remaining-friends/:username', utilities.getSuggestedFriendsForUser);
// path to show friend list for logged in user
apiRouter.get('/friendlist/:username', utilities.getFriendListForUser);
//path to show results from google maps API
apiRouter.get('/googlemaps/:location', utilities.getPlacesFromGoogleMapsProxy);
//path to show suggestions from your friends for the destination you searched for
apiRouter.get('/suggestions/:location/:username', utilities.getSuggestionsFromFriends);
apiRouter.get('/userSuggestions/:userId', utilities.getSuggestionsForUser)
//path to show all destinations
apiRouter.get('/destinations', utilities.getDestinations);
apiRouter.post('/users/:username', utilities.getLoggedUserId);
//path to add a new destination to DB
apiRouter.post('/destinations/:newdest', utilities.addNewDest);
apiRouter.post('/addfriend', utilities.addNewFriend);
//path to add a comment/suggestion for a selected destination
apiRouter.post('/addsuggestion', utilities.addNewSuggestion);
apiRouter.delete('/deletefriendship/:userID/:friendID', utilities.deleteFriendship);
apiRouter.get('/itineraries/:username', utilities.getItineraries);
apiRouter.get('/itinerary/:username/:id', utilities.getItinerary);
apiRouter.post('/itineraries', utilities.addItinerary);
apiRouter.put('/itineraries', utilities.addSuggestionToItinerary);

app.use('/api', apiRouter);

app.listen(process.env.PORT || 3000, function(){
  console.log("listening on 3000");
});


