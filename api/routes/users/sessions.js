import db from '../../db';
import to from '../../helpers/to';
import JWTSession from '../../helpers/JWTSession';
import { compare } from '../../encryption/pw';
import User from '../../models/User';

const login = async (req, res, next) => {

    try {
      let { email: requested_email, password } = req.body;
  
      if(password && requested_email) {
  
        // pull user information for validation and jwt
        const [fetchUserErr, user] = await to(User({ query: true, queryType: 'email', email: requested_email }));
        if(!user) throw new Error(fetchUserErr);
  
        let { email, passhash, id, confirmed } = user;
        if(!confirmed) throw new Error('Email address not verified');
    
        const [pwErr, secret] = await to(compare(password, passhash));
        if(!secret) throw new Error(pwErr)
  
        // setup expiration for cookie and token. 172800000 = 2 days in milliseconds
        const expireTime = 172800000,
          expiration = new Date(Date.now()) + 172800000;
  
        const [jwtErr, session] = await to(JWTSession(id, email, secret));
        if(!session) throw new Error(jwtErr)
  
        const { token } = session;
          
        // clear previous sessions from db
        // and add the new session in one task
        const [ writeSessionErr ] = await to(db.task( t => {
          return t.none('delete from user_sessions where user_id = $1', id)
            .then( () => {
              return db.none('insert into user_sessions(user_id, session_data, session_secret) values(${user_id}, ${token}, ${session_secret})', session)
            })
        }));
        if(writeSessionErr) throw new Error(writeSessionErr)
  
        const cookie_settings = {
          expires: expiration,
          maxAge: expireTime,
          httpOnly: true
        }
  
        res.status(200)
          .cookie('bsSes', token, cookie_settings)
          .cookie('bsid', id, cookie_settings)
          .json({
            status: 'success',
            message: 'Logged in!'
          })
  
      } else {
        throw new Error('Please provide and email address and a password')  
      }
    }
    catch (err) {
      console.log(err)
      res.status(400)
        .json({
          status: 'failure',
          message: err.message
        })
    }
}

const logout = async (req, res, next) => {

  try {
    const { bsid } = req.cookies
  
    const [ sessionDeleteErr ] = await to(db.none('delete from user_sessions where user_id = $1', bsid));
    if(sessionDeleteErr) throw new Error(sessionDeleteErr)

    res.status(200)
      .clearCookie('bsSes')
      .clearCookie('bsid')
      .json({
        status: 'success',
        message: 'logged out!'
      })
  }
  catch (err) {
    res.status(500)
      .json({
        status: 'failure',
        message: err.message
      })
  }
}

module.exports = { login, logout }