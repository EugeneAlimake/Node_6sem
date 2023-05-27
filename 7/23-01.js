const express = require('express');
const fs = require('fs');
const passport = require('passport');
const users = require('./users.json');
const localStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session')({
    resave: false, //сохранить даже если нет изменений
    saveUninitialized: false, //сохранить даже если нет изменений
    secret: '12345'  //если шифровать
})

passport.serializeUser((user, done) => {
    console.log('serialize', user);
    done(null, user);
});
passport.deserializeUser((user, done) => // происходит поиск пользователя по сохраненным в сессии данным пользователя
{
    console.log('deserialize', user);
    done(null, user);
});


const getCredential = (username) => {

    return users.find(e=>e.username==username) ;
}
passport.use(
    new localStrategy(async (username, password, done) => {
        let rc = null;
        let cr = getCredential(username);
        console.log(cr);
        if (!cr) rc = done(null, false, {message: 'incorrect username'});
        else rc = done(null, cr);
        return rc;
    }, (params, done) => {
        console.log('parms = ', params);
        done(null, true);
    }));


const app = express();
app.use(session);
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
    console.log('/login');
    const rs = fs.ReadStream('./23-01.html');
    rs.pipe(res);
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/resource', failureRedirect: '/login'
}));


app.get('/resource', (req, res) => {
    if (req.user) {
        const rs = fs.ReadStream('./resource.html');
        rs.pipe(res);
        console.log('resource');
    } else {
       // res.redirect('login');
        res.status(401).send(' unauthenticated attempt of access to a resourse');
    }
})

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
})

app.use((req, res) => {
    res.status(404).send('Not Found');
})

app.listen(3000, () => console.info(`Server is running on http://localhost:3000`));
