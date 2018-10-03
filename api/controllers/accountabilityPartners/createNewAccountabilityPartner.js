import shortid from 'shortid-2';

import db from '../../db';
import to from '../../helpers/to';
import randomURIComponent from '../../helpers/randomURIComponent';
import { createAccountabilityPartner } from '../../db/queryFiles/sql';

const createNewAccountabilityPartner = async (obj) => {
    try{
      const { email = null, firstName = null, lastName = null } = obj;
  
      if( email ) {
  
        const [componentErr, confirmation_code] = await to(randomURIComponent(64));
        if(!confirmation_code) throw new Error(componentErr);
  
        const ap = {
          id: shortid.generate(),
          email,
          firstName,
          lastName,
          full_user: false,
          confirmed: false,
          confirmation_code
        }
        
        /* THIS SHOULD HAPPEN IN A TASK/TRANSACTION */
        const [createErr, createdAP] = await to(db.one(createAccountabilityPartner, ap));
        if(!createdAP) throw new Error(createErr);
    
        return createdAP
      }
      else {
        throw new Error('Please provide your first name, last name, email address and a valid password');
      }
    }
    catch (err) {
      throw new Error(err.message);
    }
}

export default createNewAccountabilityPartner