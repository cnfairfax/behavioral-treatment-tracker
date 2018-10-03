import crypto from 'crypto';

import to from '../../helpers/to';
import User from '../../models/User';
import sendMail from '../../controllers/email/sendMail';
import confirmationEmail from '../../controllers/email/templates/userConfirmationEmail';

const register = async (req, res, next) => {  
    try {
      const [initErr, user] = await to(User(req.body));
      if(!user) throw new Error(initErr);

      const [writeErr, createdUser] = await to(user.Insert());
      if(!createdUser) throw new Error(writeErr)
  
      const message = confirmationEmail(createdUser);
  
      const [sendingErr, response] = await to(sendMail(message));
      if(!response) throw new Error(sendingErr);
  
      res.status(200)
        .json({
          status: 'success',
          message: 'User registered!'
        });
    } 
    catch (err) {
      res.status(500)
        .json({
          status: 'failure',
          message: err.message
        });
    }
}

export default register