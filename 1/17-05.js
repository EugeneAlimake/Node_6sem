const redis=require('redis');
const sub_client=redis.createClient();

sub_client.on('subscribe',(channel,count)=>{console.log('subscribe:','channel = ',channel,'count = ',count)});

sub_client.on('message',(channel,message)=>{console.log('sub channel: '+channel+':'+message)});
sub_client.subscribe('channel-01');
setTimeout(()=>{sub_client.unsubscribe(); sub_client.quit();
    },15000);

//-------------------------------------------------

const pub_client=redis.createClient();

pub_client.publish('channel-01','from pub-client message 1');
pub_client.publish('channel-01','from pub-client message 2');
setTimeout(()=>pub_client.publish('channel-01','from pub-client message 3'),5000);
setTimeout(()=>pub_client.publish('channel-01','from pub-client message 4'),7000);
setTimeout(()=>pub_client.publish('channel-01','from pub-client message 5'),9000);
setTimeout(()=>pub_client.publish('channel-01','from pub-client message 6'),11000);
setTimeout(()=>pub_client.quit(),15000);