import shortid from 'shortid-2';

import db from '../../db';
import to from '../../helpers/to';
import { createNewGroupLink } from '../../db/queryFiles/sql';

const linkAccountabilityParter = async (obj) => {
    try{
      const { partner_id = null, group_id = null, owner = false } = obj;
  
      if( user_id && group_id ) {

        const groupLink = {
            group_id,
            user_id: partner_id,
            owning_user: owner
        }
        
        const [createErr, createdLink] = await to(db.one(createNewGroupLink, groupLink));
        if(!createdLink) throw new Error(createErr);
        
        return createdGroup
      }
      else {
        throw new Error('Invalid group object');
      }
    }
    catch (err) {
      throw new Error(err.message);
    }
}

export default linkAccountabilityParter