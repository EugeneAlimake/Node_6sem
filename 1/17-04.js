const redis=require('redis');
const client=redis.createClient();
var now;
for (let n = 1; n < 10000; n++) {
    if(n==1){now =new Date();}
    client.hset('incr', n, JSON.stringify({id:n,val:'val-'+n}));
    if(n==9999){console.log('Time incr: '+(new Date()-now));}
}
//-------------------------------------------------
var getnow;
for (let n = 1; n < 10000; n++) {
    if(n==1){getnow =new Date();}
    client.hget('incr',n);
    if(n==9999){console.log('Time incr: '+(new Date()-getnow));}
}
client.del('incr');
client.quit();