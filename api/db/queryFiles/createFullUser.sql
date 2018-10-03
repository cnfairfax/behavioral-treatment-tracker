INSERT INTO users(id, email, firstName, lastName, passhash, full_user, confirmed, confirmation_code) 
VALUES(${id}, ${email}, ${firstName}, ${lastName}, ${passhash}, ${full_user}, ${confirmed}, ${confirmation_code})
    ON CONFLICT (email) DO UPDATE
    SET firstName = EXCLUDED.firstName,
            lastName = EXCLUDED.lastName,
            passhash = EXCLUDED.passhash,
            full_user = EXCLUDED.full_user,
            confirmed = EXCLUDED.confirmed,
            confirmation_code = EXCLUDED.confirmation_code
     WHERE
            users.full_user IS NOT TRUE AND users.email = EXCLUDED.email
RETURNING id, email, confirmation_code