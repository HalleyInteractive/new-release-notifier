global.nrn = {};

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

module.exports = global.nrn;
