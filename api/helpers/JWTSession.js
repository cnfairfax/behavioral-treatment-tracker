import jwt from 'jsonwebtoken';

const JWTSession = (id, email, secret) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { user_id: id, email: email },
        secret,
        { algorithm: 'HS512', expiresIn: '2 days' },
        (err, token) => {
          // return jwt error
          if(err) {
            reject(err.message);
          }
          // setup db session data
          resolve({
            user_id: id,
            token,
            session_secret: secret
          })
        });
    })
}

export default JWTSession