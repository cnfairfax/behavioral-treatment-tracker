import shortid from 'shortid-2';

import db from '../db';
import to from '../helpers/to';
import queries from '../db/queryFiles/Locations';

const PracticeLocation = async (arg) => {

    let { createLocation, getLocationById, getLocationByName, getAllLocationsForAccount } = queries;

    if(!arg) throw new Error('No user data');

    let location = {};

    // if passed argument is a query object, fetch user from database by either email or id
    if(arg.query) {
        if(arg.queryType === 'id') {
            const [fetchErr, returnedLocation] = await to(db.one(getLocationById, arg));
            if(!returnedLocation) throw new Error(fetchErr);

            location = returnedLocation;
        } else if(arg.queryType === 'name') {
            const [fetchErr, returnedLocation] = await to(db.one(getLocationByName, arg));
            if(!returnedLocation) throw new Error(fetchErr);

            location = returnedLocation;
        } else if(arg.queryType === 'all') {
            const [fetchErr, returnedLocations] = await to(db.any(getAllLocationsForAccount, arg))
            if(!returnedLocations) throw new Error(fetchErr);

            location.group = returnedLocations;
        } else {
            throw new Error('Invalid query');
        }
    }
    else {
        // build location object with only the present and valid properties
        if(arg.id) location.id = arg.id;
        if(arg.location_name) location.location_name = arg.location_name;
        if(arg.account_id) location.account_id = arg.account_id;
        if(arg.parent_user_id) location.parent_user_id = arg.parent_user_id;
    }
    /* Location methods to implement 
        Delete
        Update - generic

    Note: 'Get' is implemented by passing a query object to the Location factory */
    location.Insert = async () => {
        if(!location.id) location.id = shortid.generate();
        if(!location.location_name) throw new Error('Must provide location name');
        if(!location.account_id) throw new Error('No account found');
        if(!location.parent_user_id) throw new Error('No user found');

        if(location.id && location.location_name) {
            
            const [writeErr, createdLocation] = await to(db.one(createLocation, location));
            if(!createdLocation) throw new Error(writeErr)

            location.id = createdLocation.id;

            return location
        }
         
        throw new Error('Location insert failed');

    }

    location.UpdateLocation = async () => {

        const [writeErr, updatedLocation] = await to(db.one(updateLocation, location));
        if(!updatedLocation) throw new Error(writeErr);

        return updatedLocation
    }

    return location
}

export default PracticeLocation