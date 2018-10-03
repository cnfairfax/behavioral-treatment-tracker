import path from 'path';
import pgp from 'pg-promise';

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}

// Create a QueryFile globally, once per file:
export const createFullUser = sql('./createFullUser.sql');

export const isFullUser = sql('./isFullUser.sql');

export const createAccountabilityPartner = sql('./createAccountabilityPartner.sql');

export const createNewGroup = sql('./createNewGroup.sql');

export const createNewGroupLink = sql('./createGroupLink.sql');
