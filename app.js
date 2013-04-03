
/**
 * Module dependencies.
 */

var os = require('os')
  , cp = require('child_process')
  , cluster = require('cluster')
  , express = require('express')
  , routes = require('./routes')
  , auth = require('./routes/auth')
  , api = require('./routes/api')
  , admin = require('./routes/admin')
  , http = require('http')
  , path = require('path')
  , config = require('./config')
  , MongoStore = require('connect-mongo')(express);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    maxAge: 3600000,
    secret: '234654324d654324v65434f65243',
    store: new MongoStore({ url: config.db }),
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// public routes
app.get('/', routes.index);
app.get('/search', routes.search);
app.get('/episode/:id', routes.episode);

// admin routes
app.get('/login', auth.index);
app.post('/login', auth.login);
app.get('/admin', auth.check);
app.get('/admin', admin.index);
app.post('/admin/refresh', admin.refresh);
app.post('/admin/rebuild', admin.rebuild)
app.post('/admin/stop', admin.stop);

// api routes for javascript
app.get('/api/siblings/:id', api.siblings);


// make use of the extra cores on the server
var numcpus = os.cpus().length;
if (cluster.isMaster) {

  if(numcpus === 1) { cluster.fork(); } 
  else {

    // we have multiple cores availble!
    // let's start a worker spider + more web processes
    if(numcpus > 1) {
      process.nextTick(startWorker);
    }

    for (var i = 0; i < numcpus - 1; i++) {
      cluster.fork();
    }
  }

} else {

  // start server
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
}

cluster.on('exit', function(worker, code, signal) {
  console.log('worker ' + worker.process.pid + ' died, restarting...');
  cluster.fork();
});


function startWorker() {
  var spider = cp.fork('./workers/spider');
  spider.on('exit', function(code, signal) {
    console.log('spider died, restarting...');
    process.nextTick(startWorker);
  });
}