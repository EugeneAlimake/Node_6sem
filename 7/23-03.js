const redis = require("redis");
try {
    //const client = redis.createClient('//redis-12266.c99.us-east-1-4.ec2.cloud.redislabs.com:12266',
    //     {password:'xU1M17HUTLc3kKDweylhe5ywtI48pAxt');
    const client = redis.createClient();
    client.on('ready',()=>{console.log('ready')});
    client.on('error',(err)=>{console.log('error '+err)});
    client.on('connect',()=>{console.log('connect')});
    client.on('end',()=>{console.log('end')});
    client.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkV1Z2VuZSIsImlhdCI6MTY4MTI4MjI1NiwiZXhwIjoxNjgxMzY4NjU2fQ._cZ1n0FSXp-0v8HFyzUhEibkQMD64L4fvJ-GcAImplw",        (_, resp) => {
        rc =resp;
        console.log("get:", resp)
    });
    client.quit();}
catch (e) {
    console.log(e.message);
}
