const { ServerSign } = require('./Sign');
const fs = require('fs');
let rs2 = fs.createReadStream('./txt/origin_data.txt');
const app = require('express')();

app.get('/resource', (req, res, next) =>
{
    res.statusCode = 200;
    rs2.pipe(res);
    rs2.on('close', () =>
    {
        console.log(rs2.bytesRead);
        res.end();
    });
});

app.get('/', (req, res, next) =>
{
    console.log("пук");
    const ss = new ServerSign();//создает объект, который генерирует пару ключей RSA, закрытый и открытый
    const rs = fs.createReadStream('./txt/origin_data.txt');
    ss.getSignContext(rs, (signcontext) =>
    {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(signcontext));
    });
});

app.listen(3000, () =>
{
    console.log('Server is listening: 8000');
});