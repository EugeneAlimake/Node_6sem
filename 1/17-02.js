const redis=require('redis');
const client = redis.createClient();
try {
var startset;
for (let n = 1; n < 10000; n++) {
if (n==1) {startset =new Date();}
    client.set(`${n}`,`set${n}`);
if(n==9999){console.log('Time: '+(new Date()-startset));}
}

var startget;
for (let n = 1; n < 10000; n++) {
    if (n==1) {startget =new Date();}
    client.get(`${n}`);
    if(n==9999){console.log('Time: '+(new Date()-startget));}
}

var startdel;
for (let n = 1; n < 10000; n++) {
    if (n==1) {startdel =new Date();}
    client.del(`${n}`);
    if(n==9999){console.log('Time: '+(new Date()-startdel));}
}

client.quit();}
catch (e) {
    console.log(e.message());
}