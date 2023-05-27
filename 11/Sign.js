const crypto = require('crypto');

class ServerSign
{
    constructor()
    {
        const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {type: 'pkcs1', format: 'pem'},
            privateKeyEncoding: {type: 'pkcs1', format: 'pem'}
        });
        let s = crypto.createSign('SHA256');
        this.getSignContext = (rs, cb) =>
        {
            rs.pipe(s);
            rs.on('end', () =>
            {
                cb({
                    signature: s.sign(privateKey).toString('hex'),
                    publicKey: publicKey.toString('hex')
                });
            });
        };
    }
}

class ClientVerify
{
    constructor(SignContext)
    {
        const v = crypto.createVerify('SHA256');
        this.verify = (rs, cb) =>
        {
            rs.pipe(v);
            rs.on('end', () =>
            {
                cb(v.verify(SignContext.publicKey, SignContext.signature, 'hex'));
            });
        };
    }
}

module.exports.ServerSign = ServerSign;
module.exports.ClientVerify = ClientVerify;

