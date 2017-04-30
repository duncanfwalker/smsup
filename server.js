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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client')));
}

app.get(GROUPS_PATH, (req, res) => {
  groupAdmin.list()
    .then((group) => res.json(group));
});

app.put(GROUPS_PATH, (req, res) => {
  groupAdmin.save(req.body)
    .then((group) => res.json(group))
    .catch(() => res.json({ status: 'bad' }));
});


const herokuForwardHeader = 'x-forwarded-for';
const healthCheck = '51.7.198.66';
const mexcomm ='203.223.147.133';
const whitelist = [['127.0.0.1','127.0.0.10'],mexcomm, '174.37.245.32/29', '174.36.197.192/28', '173.193.199.16/28', '119.81.44.0/28',healthCheck];
app.use(ipfilter(whitelist, { mode: 'allow', allowedHeaders: [herokuForwardHeader], exclude: [GROUPS_PATH] }));

app.use(transport.createReceiveRoutes(run));

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
