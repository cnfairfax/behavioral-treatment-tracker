import shortid from 'shortid-2';

import db from '../../db';
import to from '../../helpers/to';
import randomURIComponent from '../../helpers/randomURIComponent';
import { encrypt } from '../../encryption/pw';
import { createFullUser, isFullUser } from '../../db/queryFiles/sql';

const createNewFullUser = async (obj) => {
    try{
      const { email = null, firstName = null, lastName = null, password = null } = obj;
  
      if( email && firstName && lastName && password ) {
        const [encryptErr, key] = await to(encrypt(password));
        if(!key) throw new Error(encryptErr);
  
        const [componentErr, confirmation_code] = await to(randomURIComponent(64));
        if(!confirmation_code) throw new Error(componentErr);
  
        const user = {
          id: shortid.generate(),
          email,
          firstName,
          lastName,
          full_user: true,
          passhash: key,
          confirmed: false,
          confirmation_code
        }
        
        /* THIS SHOULD HAPPEN IN A TASK/TRANSACTION */
        const [ fullUserErr, fullUser ] = await to(db.one(isFullUser, user));
        if(!fullUser) {
            const [createErr, createdUser] = await to(db.one(createFullUser, user));
            if(!createdUser) throw new Error(createErr);
    
            return createdUser
        }
        else {
            throw new Error('User already exists');
        }
      }
      else {
        throw new Error('Please provide your first name, last name, email address and a valid password');
      }
    }
    catch (err) {
      throw new Error(err.message);
    }
}

export default createNewFullUser