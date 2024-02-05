const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const catalogRouter = require('./routes/catalog')
const compression = require('compression')
const helmet = require('helmet')


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


const app = express();
const RateLimit = require('express-rate-limit')
const limiter = RateLimit({
  windowsMs: 1 * 60 * 1000,
  max: 20
})

app.use(limiter)

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'","code.jqery.com", "cdn.jsdelivr.net"]
    }
  })
)

const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
const dev_db_url = "mongodb+srv://radtrad:mongodb753951@cluster0.9oklfyh.mongodb.net/local_library?retryWrites=true&w=majority"

const mongoDB = process.env.MONGODB_URI || dev_db_url

main().catch((err) => console.log(err))
async function main() {
  await mongoose.connect(mongoDB)
}

app.use(compression())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter)

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
