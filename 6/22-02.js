const app = require('express')();
const passport = require('passport');
const DigestStrategy= require('passport-http').DigestStrategy;
const users=require('./users.json');
const session=require('express-session')(
    {
        resave:false,
        saveUninitialized:false,
        secret:'12345'
    }
);

const getCredential = (user)=>{
    let u = users.find((e)=>{ return e.user.toUpperCase() == user.toUpperCase();}); //авторизация
    return u;
}

passport.use(new DigestStrategy({gop:'auth'},(user,done)=>
{
    //Стратегия Digest предназначена для защищенной передачи учетных данных между клиентом
    // и сервером и использует хэши функции для хранения пользовательских паролей на сервере.
    let rc =null;
    let cr=getCredential(user);
    if(!cr) rc = done(null, false, {message: 'incorrect username'});
    else rc = done(null, cr.user, cr.password);
    return rc;

},(params,done)=>
{
    console.log('parms = ',params);
    done(null,true);
}));
passport.serializeUser((user,done)=>
{
    console.log('serialize',user);
    done(null,user);
});
passport.deserializeUser((user,done)=> // происходит поиск пользователя по сохраненным в сессии данным пользователя
{
    console.log('deserialize',user);
    done(null,user);
});
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.get('/login',(req,res,next)=>
{
    if(req.session.logout && req.headers['authorization'])
    {
        req.session.logout=false;
        delete req.headers['authorization'];
    }
    next();
})
    .get('/login',passport.authenticate('digest'),(req,res,next)=>
    {
        next()
    })
    .get('/login',(req,res,next)=>
    {
        res.send('success login');
    });

app.get('/resource',(req,res,next)=>
{
    if(req.headers['authorization'])
    {
        res.send('resource');
    }
    else
    {
        res.redirect('/login');
    }
});
app.get('/logout',(req,res)=>
{
    req.session.logout=true;
    res.redirect('/login');
});
app.listen(3000,()=>
{
    console.log('Start server, port:3000');
});