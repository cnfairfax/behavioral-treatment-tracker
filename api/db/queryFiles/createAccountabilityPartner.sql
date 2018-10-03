INSERT INTO users(id, email, firstName, lastName, full_user, confirmed, confirmation_code) 
VALUES(${id}, ${email}, ${firstName}, ${lastName}, ${full_user}, ${confirmed}, ${confirmation_code})
RETURNING id, email