INSERT INTO groups2users(user_id, group_id, owning_user)
VALUES(${user_id}, ${group_id}, ${owning_user})
RETURNING user_id, group_id