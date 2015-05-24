global.nrn = {};

// APPLICATION SETTINGS
global.nrn.base = __dirname;
global.nrn.ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
global.nrn.port = process.env.OPENSHIFT_NODEJS_PORT || 8085;
global.nrn.environment = global.nrn.ipaddress === '127.0.0.1' ? 'local' : 'remote';

// MONGODB CONNECTION STRING
if(global.nrn.environment === 'local') {
  global.nrn.mongoConnectionString = 'mongodb://127.0.0.1/new-release-notifier';
} else {
  global.nrn.mongoConnectionString = 'mongodb://';
  global.nrn.mongoConnectionString += process.env.MONGODB_USER + ':';
  global.nrn.mongoConnectionString += process.env.MONGODB_PASS + '@';
  global.nrn.mongoConnectionString += process.env.OPENSHIFT_MONGODB_DB_HOST + ':';
  global.nrn.mongoConnectionString += process.env.OPENSHIFT_MONGODB_DB_PORT + '/';
  global.nrn.mongoConnectionString += process.env.MONGODB_DB;
}


// GOOGLE STRATEGY SETTINGS
global.nrn.strategy = {};
global.nrn.strategy.google = {};

if(global.nrn.environment === 'local') {
  var SecretSettingsFile = require(global.nrn.base + '/../secrets.json');
  global.nrn.strategy.google.client_id = SecretSettingsFile.auth.google.client_id;
  global.nrn.strategy.google.client_secret = SecretSettingsFile.auth.google.client_secret;
  global.nrn.strategy.google.callbackURL = 'http://' + global.nrn.ipaddress + ':' + global.nrn.port + '/auth/google/callback';
} else {
  global.nrn.strategy.google.client_id = process.env.GOOGLE_CLIENT_ID;
  global.nrn.strategy.google.client_secret = process.env.GOOGLE_CLIENT_SECRET;
  global.nrn.strategy.google.callbackURL = 'http://'+process.env.APP_URL+'/auth/google/callback';
}

module.exports = global.nrn;
