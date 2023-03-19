const redis = require("redis");
try {
    //const client = redis.createClient('//redis-12266.c99.us-east-1-4.ec2.cloud.redislabs.com:12266',
    //     {password:'xU1M17HUTLc3kKDweylhe5ywtI48pAxt');
const client = redis.createClient();
client.on('ready',()=>{console.log('ready')});
client.on('error',(err)=>{console.log('error '+err)});
client.on('connect',()=>{console.log('connect')});
client.on('end',()=>{console.log('end')});
client.quit();}
catch (e) {
    console.log(e.message);
}
