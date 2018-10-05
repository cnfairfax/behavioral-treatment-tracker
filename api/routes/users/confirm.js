import to from '../../helpers/to';

import User from '../../models/User';

const confirm = async (req, res, next) => {

    try {
      const { user_id, confirmation_code_param } = req.params;
  
      const [ fetchUserErr, user ] = await to(User({
        query: 'confirmation code',
        queryType: 'id',
        id: user_id    
      }));
      let { id, confirmation_code } = user;
      console.log(user)
      if(!(id && confirmation_code)) throw new Error("Error fetching user: " + fetchUserErr);
  
      if(id === user_id && confirmation_code === confirmation_code_param) {
        let [confirmationErr, confirmedUser] = await to(user.Confirm());
        if(confirmationErr) throw new Error(confirmationErr);
      } else {
        throw new Error('Confirmation code does not match');
      }
  
      res.status(200)
          .json({
            status: 'success',
            message: 'Email confirmed!'
          })
    }
    catch (err) {
      res.status(403)
          .json({
            status: 'failure',
            message: err.message
          })
    }
}

export default confirm