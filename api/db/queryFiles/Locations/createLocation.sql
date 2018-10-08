INSERT INTO locations(id, account_id, parent_user_id, location_name) 
VALUES(${id}, ${account_id}, ${parent_user_id}, ${location_name})
RETURNING id, account_id, parent_user_id, location_name