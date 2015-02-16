#!/bin/env node

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes =
{
	index: require('./routes/index'),
	passport: require('./routes/passport'),
	users: require('./routes/users')
};

var sessionMiddleware = session(
{
	secret: 'fg783#$%f',
	store: new MongoStore({
		mongoose_connection:global.nrn.mongoose.connections[0],
		db:global.nrn.mongoose.connection.db
	}),
	resave: true,
	saveUninitialized: true
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Passport init
app.use(routes.passport.passport.initialize());
app.use(routes.passport.passport.session());

app.use('/', routes.index.router);
app.use('/', routes.passport.router);

app.use(function(req, res, next)
{
	if(req.user === undefined)
	{
		req.session.redirect_to = req.url;
		res.redirect('/login');
	} else
	{
		next();
	}
});

// AUTHENTICATED ROUTES
app.use('/', routes.users.router);


// catch 404 and forward to error handler
app.use(function(req, res, next)
{
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development')
{
	app.use(function(err, req, res, next)
{
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next)
{
	res.status(err.status || 500);
	res.render('error',
	{
		message: err.message,
		error: {}
	});
});


module.exports = app;
