var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoClient = require('mongodb').MongoClient;
const dbopr = require('./operations');
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
    console.log("Connected to the database server!");

  const db = client.db(dbname);

  dbopr.insertDocument(db, { name: "Uthapizza", description: "Test"}, 'dishes', (result) => {
    console.log("Inserted document:\n ", result.ops);

    dbopr.findDocuments(db, 'dishes', (docs) => {
      console.log("Found Documents:\n", docs);

      dbopr.updateDocument(db, {name: "Uthapizza"}, {description: "updated test"}, 'dishes', (result) => {
        console.log("Updated Document:\n ", result.result);

        dbopr.findDocuments(db, 'dishes', (docs) => {
          console.log("Found Documents:\n", docs);

          db.dropCollection('dishes', (result) => {
            console.log("Dropped the collection:\n", result);
            client.close();
          });
        });
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
