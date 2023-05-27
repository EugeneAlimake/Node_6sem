const http = require('http');
const { ClientDH } = require('./diffieHellman');
const fs = require('fs');
const decipherFile = require('./27-01').decipherFile;
let params;
let clientDH;

let options =
    {
        host: 'localhost',
        path: '/',
        port: 3000,
        method: 'GET',
        headers: {'content-type': 'application/json'}
    }
let setKey_options =
    {
        host: 'localhost',
        path: '/setKey',
        port: 3000,
        method: 'POST'
    }
let resource_options =
    {
        host: 'localhost',
        path: '/resource',
        port: 3000,
        method: 'GET'
    }

// (GET /)
const req = http.request(options, (res) =>
{
    console.log("пук");
    let data = '';
    res.on('data', (chunk) =>
    {
        data += chunk.toString('utf-8');
    });
    res.on('end', () =>
    {
        let serverContext = JSON.parse(data);
        clientDH = new ClientDH(serverContext);// возвращает открытый ключ и параметры Диффи-Хеллмана
        //params = "["+JSON.stringify(clientDH.getContext())+"]";
        params = JSON.stringify(clientDH.getContext());
        //POST (/setKey)
        const req2 = http.request(setKey_options, (res) =>
        {//Если сервер успешно обработал запрос, то код продолжает выполняться
            if (res.statusCode !== 409)
            {//GET (/resource)

                const req3 = http.request(resource_options, (res) =>
                {
                    if (res.statusCode !== 409)
                    {
                        console.log("зашло")
                        const file = fs.createWriteStream('./txt/client_decrypted_data.txt');
                        const key = new Buffer.alloc(32);
                        let clientSecret = clientDH.getSecret(serverContext);
                        console.log("зашло")
                        clientSecret.copy(key, 0, 0, 32)
                        decipherFile(res, file, key);//расшифровывает полученные данные и записывает их в файл.
                    }
                });
                req3.on('error', (e) =>
                {
                    console.log('http.request: error:', e.message);
                });
                req3.end();
            }
        });
        req2.on('error', (e) =>
        {
            console.log('http.request: error:', e.message);
        });
        console.log(params);
        req2.write(params);
        req2.end();
    });
});
req.on('error', (e) =>
{
    console.log('http.request: error:', e.message);
});
req.end();