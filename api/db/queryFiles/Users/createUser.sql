INSERT INTO users(id, email, firstName, lastName, passhash, confirmed, confirmation_code, account_id) 
VALUES(${id}, ${email}, ${firstName}, ${lastName}, ${passhash}, ${confirmed}, ${confirmation_code}, ${account_id})
RETURNING id, email, confirmation_code