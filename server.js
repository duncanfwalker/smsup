var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var httpLogger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var winston  = require('winston');
const autoReplier = require( './server/transport/autoReplier');
const transport = require('./server/transport/transport');
const groupAdmin = require('./server/subscription/group-service');
const ipfilter = require('express-ipfilter').IpFilter;
const commands = require('./server/commands');
const { run } = require('./server/routing/command-router');
const mongoose = require('mongoose');
const listenForCommandEvents = require('./server/listeners');
const setupAuth = require('./server/admin/admin-auth');
const passwordless = require('passwordless');

listenForCommandEvents();
mongoose.connect(process.env.MONGODBURI);

const  GROUPS_PATH = '/group';

if(process.env.LOG_LEVEL) {
  winston.level = process.env.LOG_LEVEL;
  console.log(winston.level);
}
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(httpLogger("dev",{ "stream": {
  write(message, encoding){
    winston.info(message);
  }
}}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
setupAuth(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client')));
}

const adminAuth = process.env.TOGGLE_ADMIN_AUTH_DISABLED ? (req, res, next) => next() : passwordless.restricted();

app.get(`${GROUPS_PATH}/`, adminAuth, (req, res) => {
  groupAdmin.list()
    .then((group) => res.json(group));
});

app.put(`${GROUPS_PATH}/`, adminAuth, (req, res) => {
  groupAdmin.save(req.body)
    .then((group) => res.json(group))
    .catch(() => res.json({ status: 'bad' }));
});
app.post(`${GROUPS_PATH}/`, adminAuth, (req, res) => {
  groupAdmin.update(req.body)
    .then((group) => res.json(group))
    .catch(() => res.json({ status: 'bad' }));
});

app.delete(`${GROUPS_PATH}/:id`, adminAuth, (req, res) => {
  groupAdmin.deleteGroup(req.params.id)
    .then(() => res.status(200).send())
    .catch(() => res.status(500).send());
});

const whitelist = [['127.0.0.1', '127.0.0.10'], ...(process.env.IP_WHITELIST.split(','))];
const herokuForwardHeader = 'x-forwarded-for';
const gatewaysOnly = ipfilter(whitelist, { mode: 'allow', allowedHeaders: [herokuForwardHeader] });
app.use('/api', [gatewaysOnly, transport.createReceiveRoutes(run)]);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err);
  // render the error page
  res.status(err.status || 500);

  res.json({status: 'error'});
});

module.exports = app;
