SELECT id, account_id, parent_user_id, location_name
FROM locations 
WHERE location_name = ${id} AND account_id = ${account_id};