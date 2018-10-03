import crypto from 'crypto';

const randomURIComponent = async (byteNum) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(byteNum, (err, buffer) => {
        if(err) {
          reject(err);
        }
  
        const string = buffer.toString('hex');
        resolve(string);
      });
    });
}

export default randomURIComponent