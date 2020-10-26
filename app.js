var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//mount router 
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes',dishRouter)
app.use('/promotions',promoRouter)
app.use('/leaders',leaderRouter)

mongoClient.connect(url, (err, client) => {
  if(err == null)
    console.log("connected");
  const db = client.db(dbname);

  const collection = db.collection('dishes');

  collection.insertOne({ "name": "Uthapizza", "description": "Test"}, (err, result) => {
    if(err == null)
      console.log("inserted");
    console.log(result.ops);

    collection.find({}).toArray((err, docs) => {
      if(err == null)
        console.log("Found:\n");

      console.log(docs);

      db.dropCollection('dishes', (err, result) => {
        if(err == null)
          console.log("Collection deleted");
        
        client.close();
      });
    });
  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
