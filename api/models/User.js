import shortid from 'shortid-2';

import db from '../db';
import to from '../helpers/to';
import randomURIComponent from '../helpers/randomURIComponent';
import { encrypt } from '../encryption/pw';
import { createFullUser, getUserByEmail, getUserById, getUserConfirmationById, confirmUser } from '../db/queryFiles/sql';

const User = async (arg) => {
    if(!arg) throw new Error('No user data');

    let newUser = {};

    // if passed argument is a query object, fetch user from database by either email or id
    if(arg.query) {
        if(arg.queryType === 'id') {
            if(arg.query === 'confirmation code') {
                const [fetchErr, returnedUser] = await to(db.one(getUserConfirmationById, arg));
                if(!returnedUser) throw new Error(fetchErr);
            } else {
                const [fetchErr, returnedUser] = await to(db.one(getUserById, arg));
                if(!returnedUser) throw new Error(fetchErr);
            }

            newUser = returnedUser;
        } else if(arg.queryType === 'email') {
            const [fetchErr, returnedUser] = await to(db.one(getUserByEmail, arg));
            if(!returnedUser) throw new Error(fetchErr);

            newUser = returnedUser;
        } else {
            throw new Error('Invalid query');
        }
    }
    else {
        // build user object with only the present and valid properties
        if(arg.id) newUser.id = arg.id;
        if(arg.email) newUser.email = arg.email;
        if(arg.firstName) newUser.firstName = arg.firstName;
        if(arg.lastName) newUser.lastName = arg.lastName;
        if(arg.full_user) newUser.full_user = arg.full_user;
        if(arg.confirmed) newUser.confirmed = arg.confirmed;
        if(arg.confirmation_code) newUser.confirmation_code = arg.confirmation_code;
        if(arg.password) {
            const [encryptErr, key] = await to(encrypt(arg.password));
            if(!key) throw new Error(encryptErr);

            newUser.passhash = key;
        }
    }
    /* User methods to implement 
        Delete
        Update
        IsFullUser
        IsConfirmed
        GetPasshash

    Note: 'Get' is implemented by passing a query object to the User factory */
    newUser.Insert = async () => {
        if(!newUser.id) newUser.id = shortid.generate();
        if(!newUser.confirmation_code) {
            const [componentErr, confirmation_code] = await to(randomURIComponent(64));
            if(!confirmation_code) throw new Error(componentErr);

            newUser.confirmation_code = confirmation_code
        }
        if(!newUser.hasOwnProperty('confirmed')) newUser.confirmed = false;
        if(!newUser.hasOwnProperty('full_user')) newUser.full_user = true;
        if(!newUser.firstName || !newUser.lastName) throw new Error('Must provide first and last names');
        if(!newUser.email) throw new Error('Must provide email address');
        if(!newUser.passhash) throw new Error('New users must have a password');
        if(newUser.id && newUser.email && newUser.lastName && newUser.firstName && newUser.confirmation_code && newUser.hasOwnProperty('confirmed') && newUser.hasOwnProperty('full_user')) {
            const [ fullUserErr, fullUser ] = await to(db.one(isFullUser, newUser));
            if(!fullUser) {
                const [writeErr, createdUser] = await to(db.one(createFullUser, newUser));
                if(!createdUser) throw new Error(writeErr)

                newUser.id = createdUser.id;

                return newUser
            }
            else {
                throw new Error('User already exists');
            }
        }

        throw new Error('Insert failed');
    }

    newUser.Confirm = async ( idObj ) => {
        let [confirmErr, blank] = await to(db.none(confirmUser, idObj));
        if(confirmErr) throw new Error(confirmErr);

        return newUser;
    }

    newUser.GetPasshash = async () => {
    
    }

    return newUser
}

export default User