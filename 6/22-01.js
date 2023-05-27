const app = require('express')();
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('./users.json');
const session = require('express-session')({
    resave: false, //сохранить даже если нет изменений
    saveUninitialized: false, //сохранить даже если нет изменений
    secret: '12345'  //если шифровать
})
const getCredential = (user) => {
    let u = users.find((e) => {
        return e.user.toUpperCase() == user.toUpperCase();
    });
    return u;
}
const verPassword = (pass1, pass2) => {
    return pass1 == pass2;
};

passport.use(new BasicStrategy((user, password, done) => {
    let rc = null;
    let cr = getCredential(user);
    if (!cr) rc = done(null, false, {message: 'incorrect username'});
    else if (!verPassword(cr.password, password)) rc = done(null, false, {message: 'incorrect password'});
    else rc = done(null, user);
    return rc;
},(params,done)=>
{
    console.log('parms = ',params);
    done(null,true);
}));

passport.serializeUser((user, done) => {
    console.log('serialize', user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('deserialize', user);
    done(null, user);
})

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res, next) => {

        if (req.session.logout && req.headers['authorization']) {
            req.session.logout = false;
            delete req.headers['authorization'];
        }
        next();
    },
    passport.authenticate('basic'), (req, res, next) => {
        next();
    }
).get('/login', (req, res, next) => {
    if (req.headers['authorization']) {
        res.send('success login');
    } else {
        res.redirect('/login');
    }
});


app.get('/resource', (req, res, next) => {
    if (req.headers['authorization']) {
        res.send('resource');
    } else {
        res.redirect('/login');
    }
});
app.get('/logout', (req, res) => {
    req.session.logout = true;
    res.redirect('/login');
});
app.listen(3000, () => {
    console.log('server');
});