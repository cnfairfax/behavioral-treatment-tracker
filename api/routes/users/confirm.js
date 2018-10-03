import db from '../../db';
import to from '../../helpers/to';

import User from '../../models/User';

const confirm = async (req, res, next) => {

    try {
      const { user_id, confirmation_code_param } = req.params;
  
      let [ fetchUserErr, { id, confirmation_code } ] = await to(User({
        queryType: 'id',
        query: user_id    
      }));
      if(!(id && confirmation_code)) throw new Error(fetchUserErr);
  
      if(id === user_id && confirmation_code === confirmation_code_param) {
        await db.none('update users set confirmed = true where id = $1', id)
      } else {
        throw new Error('Confirmation code does not match')
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