let app = require('express')();
let https = require('https');
let fs = require('fs');
let os = require("os");
let options = {
    passphrase: "1707",
    key: fs.readFileSync('RECOURSE.key').toString(),
    cert: fs.readFileSync('RECOURSE.crt').toString()
};
https.createServer(options,app).listen(3000, ()=>{console.log(os.hostname())});

app.get('/',(req,res,next)=>
{
    console.log('hello from https');
    res.end("It's amazing, it's work");
});
