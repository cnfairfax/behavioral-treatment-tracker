SELECT id, account_id, parent_user_id, location_name
FROM locations 
WHERE account_id = ${account_id};