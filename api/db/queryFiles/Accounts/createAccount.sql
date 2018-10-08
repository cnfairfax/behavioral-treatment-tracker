INSERT INTO accounts(id, account_name)
VALUES(${id}, ${account_name})
RETURNING id, account_name