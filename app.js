
/**
 * Module dependencies.
 */

var express = require('express')

var app = module.exports = express.createServer();

var winston = require('winston');

var email = require("mailer");

var config = require('./conf/conf.js');

// Configuration

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'alertbirds.log' })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'exceptions.log'})
  ]
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.errorHandler()); 
	logger.add(winston.transports.Loggly, config.loggly);
});

// Routes

var redFlag = false;

app.post('/', function(req,res) {
	console.log(req.body);
	var emailConfig = config.email
	var subject = '';
	var time = new Date(req.body.last_state_change * 1000);
	console.log(time);
	switch(req.body.event) {
		case 'trigger':
			subject = 'Alert triggered: ';
			break;
		case 'resolve':
			subject = 'Alert resolved: ';
			break;
		default:
			subject = 'Alert: ';
	};
	subject += req.body.description;
	emailConfig.subject = subject;
	emailConfig.template = 'alert.txt';
	emailConfig.data = {
		id: req.body.id,
		description: req.body.description,
		event: req.body.event,
		last_state_change: req.body.last_state_change,
		timeString: time.toString(),
		threshold: req.body.threshold
	};
	res.send(200);
	email.send(emailConfig, function(err,result) {
		if (err) {
			redFlag = true;
			logger.error(err + req.body);
		} else {
			redFlag = false;
			logger.info('Alert sent. id: ' + req.body.id);
		}
	});
});

app.get('/health', function(req,res) {
	if ( redFlag === true ) {
		res.send(503);
	} else {
		res.send(200);
	}
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
