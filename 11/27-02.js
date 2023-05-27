const http =require('http');
const fs=require('fs');
const { ClientVerify } = require('./Sign');

let resource_options =
    {
        host: 'localhost',
        path: '/resource',
        port: 3000,
        method:'GET'
    }
let options=
    {
        host: 'localhost',
        path: '/',
        port: 3000,
        method:'GET',
        headers: {'content-type':'application/json'}
    }

const request = http.request(resource_options,(res)=>
{
    const file = fs.createWriteStream('./txt/verified_data.txt');
    res.pipe(file);

    const req = http.request(options,(res)=>
    {
        let data = '';
        res.on('data',(chunk) => {data+=chunk.toString('utf-8');});
        res.on('end',()=>
        {
            let signcontext = JSON.parse(data);//содержит контекст подписи
            console.log(signcontext)
            const x = new ClientVerify(signcontext);//используется для проверки подписи данных, содержащихся в файле
            setTimeout(()=>{
                const rs = fs.createReadStream('./txt/verified_data.txt');
                x.verify(rs, (result) => {
                    console.log('result:', result);
                })
            }, 7000)
        });
    });
    req.on('error', (e)=> {console.log('http.request: error:', e.message);});
    req.end();
});
request.on('error', (e)=> {console.log('http.request: error:', e.message);});
request.end();