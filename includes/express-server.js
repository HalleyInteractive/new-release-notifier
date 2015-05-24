#!/bin/env node

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes =
{
	passport: require(global.nrn.base + '/includes/routes/passport'),
	authenticated:
	{
		api_profile: require(global.nrn.base + '/includes/routes/api/profile')
	}
};

var sessionMiddleware = session(
{
	secret: 'fg783#$%f',
	store: new MongoStore({
		mongooseConnection:global.nrn.mongoose.connection
	}),
	resave: true,
	saveUninitialized: true
});

var app = express();

app.use(favicon(global.nrn.base + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(express.static(path.join(global.nrn.base, 'public')));

// Passport init
app.use(routes.passport.passport.initialize());
app.use(routes.passport.passport.session());
app.use('/', routes.passport.router);

app.use('/api/*', function(req, res, next)
{
	// TODO: Is checking if req.user exists enough to determine if the user is logged in?
	if(req.user === undefined)
	{
		res.status(401).end();
	} else
	{
		next();
	}
});

// Include all routes that should be authenticated.
for(var routeName in routes.authenticated)
{
	if(routes.authenticated.hasOwnProperty(routeName))
	{
		app.use('/', routes.authenticated[routeName].router);
	}
}

// Catch all routes and serve the index.html
app.use(function(req, res, next)
{
    res.sendFile(global.nrn.base + '/public/index.html');
});

// error handlers
// development error handler
// will print stacktrace
if(app.get('env') === 'development')
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
