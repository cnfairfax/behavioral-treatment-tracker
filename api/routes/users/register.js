import crypto from 'crypto';

import to from '../../helpers/to';
import User from '../../models/User';
import Account from '../../models/Account';
import sendMail from '../../controllers/email/sendMail';
import confirmationEmail from '../../controllers/email/templates/userConfirmationEmail';

const register = async (req, res, next) => {  
    try {
      // Init a user from the request object body
      const [userInitErr, user] = await to(User(req.body));
      if(!user) throw new Error(userInitErr);

      // Init an account from the request object body
      const [accountInitErr, account] = await to(Account(req.body));
      if(!account) throw new Error(accountInitErr);

      // Insert the account to the db - no parent user, yet
      const [accountWriteErr, createdAccount] = await to(account.Insert());
      if(!createdAccount) throw new Error(accountWriteErr);

      // re-init account w/ retruned account from db
      const [newAccountInitErr, newAccount] = await to(Account(createdAccount));
      if(!newAccount) throw new Error(newAccountInitErr);

      // Insert the new user to the db
      const [userWriteErr, createdUser] = await to(user.Insert(newAccount.id));
      if(!createdUser) throw new Error(userWriteErr);

      // Update account with the parent_user_id
      const [accountUpdateErr, returnedAccount] = await to(newAccount.UpdateParentUser(createdUser));
      if(!createdUser) throw new Error(accountUpdateErr);
  
      // Init confirmation email
      const message = confirmationEmail(createdUser);

      // Send confirmation email  
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