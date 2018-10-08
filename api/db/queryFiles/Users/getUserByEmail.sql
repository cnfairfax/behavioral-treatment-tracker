SELECT id, email, firstName, lastName, confirmed, passhash, account_id
FROM users
WHERE email = ${email};