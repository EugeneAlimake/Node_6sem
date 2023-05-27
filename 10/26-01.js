let app = require('express')();
let https = require('https');
let fs = require('fs');
let os = require("os");
let options = {
    passphrase: "1707",
    key: fs.readFileSync('LAB.key').toString(),
    cert: fs.readFileSync('LAB.crt').toString()
};
https.createServer(options,app).listen(3000, ()=>{console.log(os.hostname())});

app.get('/',(req,res,next)=>
{
    console.log('hello from https');
    res.end();
});
