const { ServerDH } = require('./diffieHellman');
const fs = require('fs');
const app = require('express')();
const bodyParser = require('body-parser');
const cipherFile = require('./27-01').cipherFile;
let serverDH;
let serverSecret;
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res, next) =>
{
    console.log("пук");
    serverDH = new ServerDH(1024, 3)//генерирует новый объект класса ServerDH с заданными параметрами len_a и g (размер ключа и генератор)
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(serverDH.getContext()));
});

app.post('/setKey', (req, res, next) =>
{
    let body = '';
    req.on('data', chunk =>
    {
        body += chunk.toString();
    });
    req.on('end', () =>
    {
        const clientContext = JSON.parse(body);
        if (clientContext.key_hex !== undefined)
        {
            serverSecret = serverDH.getSecret(clientContext);//Эта строка используется для вычисления общего секретного ключа между клиентом и сервером с помощью протокола Диффи-Хеллмана.
            console.log('serverSecret:', serverSecret);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            const key = new Buffer(32);
            serverSecret.copy(key, 0, 0, 32);//код копирует первые 32 байта из буфера serverSecret в новый буфер key начиная с индекса 0.

            const rs = fs.createReadStream('./txt/origin_data.txt');
            const ws = fs.createWriteStream('./txt/crypted_data.txt');
            cipherFile(rs, ws, key);
            res.end('Success');
        }
        else
        {
            res.status(409).send('Failure');
        }
    });
});

app.get('/resource', (req, res, next) =>
{
    if (serverSecret !== undefined)
    {
        res.statusCode = 200;
        let rs2 = fs.createReadStream('./txt/crypted_data.txt');
        rs2.pipe(res);
        rs2.on('close', () =>
        {
            console.log(rs2.bytesRead);
            res.end();
        });
    }
    else
    {
        res.status(409).send('Failure');
    }
});

app.listen(3000, () =>
{
    console.log('Server is listening: 3000');
});