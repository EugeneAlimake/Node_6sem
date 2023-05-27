const crypto = require('crypto')
class ServerDH
{
    constructor(len_a, g)
    //Аргумент len_a определяет длину секретного ключа Диффи-Хеллмана в битах.
    //Аргумент g определяет число-генератор для Диффи-Хеллмана.
    {//1024, 3
        //В этих строках кода создается объект dh класса DiffieHellman
        const dh = crypto.createDiffieHellman(len_a, g);
        const p = dh.getPrime();
        const gb = dh.getGenerator();
        const k = dh.generateKeys();
        this.getContext = () =>
        {
            return {
                p_hex: p.toString('hex'),
                g_hex: gb.toString('hex'),
                key_hex: k.toString('hex')
            };
        };
        //метод, который вычисляет общий секрет между сервером и клиентом на основе обмена ключами Диффи-Хеллмана
        this.getSecret = (clientContext) => {
            const k = Buffer.from(clientContext.key_hex, 'hex');//публичный ключ затем конвертируется из шестнадцатеричного формата в бинарный формат
            return dh.computeSecret(k);
        };
    }
}

class ClientDH {
    constructor(serverContext)
    {
        const ctx = {
            p_hex: serverContext.p_hex ? serverContext.p_hex : '1111',
            g_hex: serverContext.g_hex ? serverContext.g_hex : '1',
        };
        const p = Buffer.from(ctx.p_hex, 'hex');
        const g = Buffer.from(ctx.g_hex, 'hex');
        const dh = crypto.createDiffieHellman(p, g);
        const k = dh.generateKeys();
        this.getContext = () =>
        {
            return {
                p_hex: p.toString('hex'),
                g_hex: g.toString('hex'),
               //key_hex: k.toString('hex')
            };
        };
        this.getSecret = (serverContext) =>
        {
            const k = Buffer.from(serverContext.key_hex, 'hex');
            return dh.computeSecret(k);
        };
    }
}

module.exports.ServerDH = ServerDH;
module.exports.ClientDH = ClientDH;