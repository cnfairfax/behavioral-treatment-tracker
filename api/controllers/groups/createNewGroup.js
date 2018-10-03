import shortid from 'shortid-2';

import db from '../../db';
import to from '../../helpers/to';
import { createNewGroup, createNewGroupLink } from '../../db/queryFiles/sql';

const creatingNewGroup = async (obj) => {
    try{
      const { user_id = null } = obj;
  
      if( user_id ) {

        const id = shortid.generate();
  
        const group = {
          id
        }

        const groupLink = {
            group_id: id,
            user_id,
            owning_user: true
        }
        
        const [createErr, createdGroup] = await to(db.tx(t => {
            const createGroup = t.one(createNewGroup, group);
            const createGroupLink = t.one(createNewGroupLink, groupLink);

            return t.batch([createGroup, createGroupLink]);
        }));
        if(!createdGroup) throw new Error(createErr);
        
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

export default creatingNewGroup