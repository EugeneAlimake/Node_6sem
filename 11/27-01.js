const crypto = require('crypto')
module.exports.cipherFile = (readStream, writeStream, key) =>
{
    const alg = 'aes-256-cbc';
    const piv = Buffer.alloc(16, 0);
    const ch = crypto.createCipheriv(alg, key, piv);
    readStream.pipe(ch).pipe(writeStream);
}

module.exports.decipherFile = (readStream, writeStream, key, iv, callback) =>
{
    const alg = 'aes-256-cbc';
    const piv = iv ? iv : Buffer.alloc(16, 0);
    const dch = crypto.createDecipheriv(alg, key, piv);
    readStream.pipe(dch).pipe(writeStream);
}