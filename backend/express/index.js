var createError = require('http-errors');
var express = require('express');
var path = require('path');

var session = require('express-session')
var SQLiteStore = require('connect-sqlite3')(session);

var indexRouter = require('./routes');
// var usersRouter = require('./routes/users');

var app = express();

// session setup
var session = require('express-session');
app.use(session({
    store: new SQLiteStore,
    secret: 'n:*RJATH:*Ath:(A*DRtTH7atd)BARTJdU&',
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// Routing of static files needs to happen before indexRouter
// Because indexRouter creates a policy that everything returns 403 if not loged in
// And the actual login page is in the public dir
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/', indexRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
    console.log(err.message)
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
});

module.exports = app;
