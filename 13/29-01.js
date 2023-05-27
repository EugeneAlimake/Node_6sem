const JsonRPCSever = require('jsonrpc-server-http-nats');
const server = new JsonRPCSever();

const bin_validator = (param)=>
{
    const a = param[0] || param.a;
    const b = param[1] || param.b;
    let param1=[a,b];
    console.log('validation', param1);
   if(!Array.isArray(param1))               throw new Error('ожидается массив');
   if(param1.length != 2)                   throw new Error('ожидаются 2 значения')
    param1.forEach(p=>{if(!isFinite(p))      throw new Error ('ожидается число')});
    return param1;
}

const sumTo = (params) =>
{
    let sum = 0;
    params.map(param => sum += param);
    return sum;
}

const mulTo = (params)=>
{
    let mul = 1;
    params.map(param => mul *= param);
    return mul;
}

server.on('div', bin_validator, (params, channel, resp) => {resp(null, params[0]/params[1]);});
server.on('proc', bin_validator, (params, channel, resp) => {resp(null, params[0]/params[1]*100);});
server.on('sum', bin_validator, (params, channel, resp) => {resp(null, sumTo(params));});
server.on('mul', bin_validator, (params, channel, resp) => {resp(null, mulTo(params));});

server.listenHttp({host:'127.0.0.1', port:3000}, ()=>{console.log('JSON RPC')});