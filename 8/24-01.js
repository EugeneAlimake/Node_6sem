const app = require('express')();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session')({resave: false, saveUninitialized: false, secret: '12345678'});

passport.use(new GoogleStrategy({
    clientID: '1016708708684-hflbn5hcu99m3jeqtm56praf6l0ret6n.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (token, refreshToken, profile, done) => done(null, {profile: profile, token: token})));

passport.serializeUser((user, done) =>
{
    console.log(user);
    done(null, user);
});
passport.deserializeUser((user, done) =>
{
    done(null, user);
});

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) =>
{
    res.sendFile(__dirname + '/login.html');
});

app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}));

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}), (req, res) =>
{
    res.redirect('/resource')
});

app.get('/resource', (req, res) =>
{
    if (req.user)
    {
        res.status(200).send(`Resource: ${req.user.profile.id}, ${req.user.profile.displayName}`);
    }
    else
    {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res,next) =>
{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
   // res.redirect('');
});
app.use((req, res) => {
    res.status(404).send('Not Found');
})

app.listen(3000, () => console.log('Server is running on http://localhost:3000/'));