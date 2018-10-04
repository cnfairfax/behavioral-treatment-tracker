INSERT INTO accounts(id, account_name, parent_user_id)
VALUES(${id}, ${account_name}, ${parent_user_id})
RETURNING id, account_name