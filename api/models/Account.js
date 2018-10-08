import shortid from 'shortid-2';

import db from '../db';
import to from '../helpers/to';
import randomURIComponent from '../helpers/randomURIComponent';
import { encrypt } from '../encryption/pw';
import queries from '../db/queryFiles/Accounts';

const Account = async (arg) => {

    let { createAccount, getAccountById, getAccountByName, updateAccountParentUser } = queries;

    if(!arg) throw new Error('No user data');

    let account = {};

    // if passed argument is a query object, fetch user from database by either email or id
    if(arg.query) {
        if(arg.queryType === 'id') {
            const [fetchErr, returnedAccount] = await to(db.one(getAccountById, arg));
            if(!returnedAccount) throw new Error(fetchErr);

            account = returnedAccount;
        } else if(arg.queryType === 'name') {
            const [fetchErr, returnedAccount] = await to(db.one(getAccountByName, arg));
            if(!returnedAccount) throw new Error(fetchErr);

            account = returnedAccount;
        } else {
            throw new Error('Invalid query');
        }
    }
    else {
        // build account object with only the present and valid properties
        if(arg.id) account.id = arg.id;
        if(arg.account_name) account.account_name = arg.account_name;
        if(arg.parent_user_id) account.parent_user_id = arg.parent_user_id;
    }
    /* Account methods to implement 
        Delete
        Update - generic

    Note: 'Get' is implemented by passing a query object to the Account factory */
    account.Insert = async () => {
        if(!account.id) account.id = shortid.generate();
        if(!account.account_name) throw new Error('Must provide account name');

        if(account.id && account.account_name) {
            
            const [writeErr, createdAccount] = await to(db.one(createAccount, account));
            if(!createdAccount) throw new Error(writeErr)

            account.id = createdAccount.id;

            return account
        }
         
        throw new Error('Account insert failed');

    }

    account.UpdateParentUser = async (user) => {
        account.parent_user_id = user.id;

        const [writeErr, updatedAccount] = await to(db.none(updateAccountParentUser, account));
        if(!updatedAccount) throw new Error(writeErr);

        account.parent_user_id = updatedAccount.parent_user_id

        return account
    }

    return account
}

export default Account