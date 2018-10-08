SELECT id, email, firstName, lastName, confirmed, passhash
FROM users
WHERE email = ${email};