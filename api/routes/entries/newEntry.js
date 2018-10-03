import shortid from 'shortid-2';

import db from '../../db';
import to from '../../helpers/to';

const newEntry = async (req, res, next) => {
    try{
        const [entryErr, entry] = await to(db.one('insert into entries(id, user_id, study_type) values($1, $2, $3) returning id, study_type, created_on', [shortid.generate(), req.cookies.bsid, req.params.type]));
        if(!entry) throw new Error(entryErr)

        res.status(200)
            .json({
                status: 'success',
                message: entry
            })
    }
    catch(err) {
        res.status(500)
                .json({
                    status: 'failure',
                    message: err.message
                })
    }
}

export default newEntry