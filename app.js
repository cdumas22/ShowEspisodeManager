
/**
 * Module dependencies.
 */

var express = require('express'),
    express_resource = require('express-resource'),
    routes = require('./routes'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
    mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    mongoserver = new Server('localhost', 27017, { auto_reconnect: true });
//--------------SOCKET.IO----------------------
//global
io = require('socket.io').listen(server);
socket = null;
io.sockets.on('connection', function(soc) {
    socket = soc;
    console.log(soc);
});
//--------------END SOCKET.IO----------------------
//---------------DATABASE-----------------------
//global
BSON = mongo.BSONPure;
db = new Db('episodedb', mongoserver, { safe: true});


db.open(function (err, db) {
    if (!err) {
        console.log("Connected to 'episodedb' database");
        db.collection('episodes', { strict: true }, function (err, collection) {
            if (err) {
                console.log("The 'episodes' collection doesn't exist.");
            }
        });
        db.collection('shows', { strict: true }, function (err, collection) {
            if (err) {
                console.log("The 'shows' collection doesn't exist.");
            }
        });
    }
});
//---------------END DATABASE-----------------------
//---------------APP SERVER-----------------------
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { pretty: false });
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/', routes.index);

//restful paths
var shows = app.resource('shows', require('./routes/Show'));
var episodes = app.resource('episodes', require('./routes/Episode'));
shows.add(episodes);
//---------------END APP SERVER-----------------------
