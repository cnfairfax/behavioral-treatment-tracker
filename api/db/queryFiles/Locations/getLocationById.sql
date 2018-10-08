SELECT id, account_id, parent_user_id, location_name
FROM locations 
WHERE id = ${id} AND account_id = ${account_id};