import crypto, { pbkdf2 } from 'crypto';

const encrypt = (text) => {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(64).toString('base64');
        const iterations = 10000;
        const method = 'sha512'
        pbkdf2(text, salt, iterations, 64, method, (err, key) => {
            if(err){
                reject(err);
            }

            key = salt + ':' + iterations + ':' + method + ':' + key.toString('hex');

            resolve(key);
        });
    });
}

const compare = (plainText, hash) => {
    return new Promise((resolve, reject) => {
        const settings = hash.split(':');

        const salt = settings[0];
        const iterations = settings[1] - 0;
        const method = settings[2];
        hash = settings[3];

        pbkdf2(plainText, salt, iterations, 64, method, (err, key) => {
            if(err) {
                reject([err, null]);
            }
            if(key.toString('hex') === hash) {
                const secret = crypto.randomBytes(128).toString('base64');
                resolve(secret);
            } else {
                reject('Invalid password');
            }
        });
    })
}

module.exports = { encrypt, compare }