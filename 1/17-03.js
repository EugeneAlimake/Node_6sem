const redis=require('redis');
const client=redis.createClient();
client.set('incr','0');
var incrnow;
for (let n = 1; n < 10000; n++) {
    if(n==1){incrnow =new Date();}
    client.incr('incr');//прибавление
    if(n==9999){console.log('Time incr: '+(new Date()-incrnow));}
}
//-------------------------------------------------

var decrnow;
for (let n = 1; n < 10000; n++) {
    if(n==1){decrnow =new Date();}
    client.decr('incr');//уменьшении
    if(n==9999){console.log('Time incr: '+(new Date()-decrnow));}
}
client.del('incr');
client.quit();