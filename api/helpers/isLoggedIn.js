import jwt from 'jsonwebtoken'

import db from '../db';

const isLoggedIn = (req, res, next) => {
    const { bsSes, bsid } = req.cookies;
    if(bsSes && bsid) {
        db.result('select session_secret, user_id, id from user_sessions where user_id = $1', bsid)
            .then( (result) => {
                if( result.rows.length !== 1 ) {
                    res.status(404)
                        .json({
                            status: 'failure',
                            message: 'no session found'
                        })
                } else {
                    const { session_secret, user_id, id } = result.rows[0]

                    jwt.verify(bsSes, session_secret, { algorithm: 'HS512'}, (err, decoded) => {
                        if(!err) {
                            next();
                        } else {
                            console.log(err);
                            res.status(400)
                                .json({
                                    status: 'failure',
                                    message: err
                                })
                        }
                    })
                }
            });
    } else {
        res.status(400)
            .json({
                status: 'failure',
                message: 'no cookies, not logged in!'
            })
    }
    
}

export default isLoggedIn