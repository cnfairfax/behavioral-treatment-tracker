DROP DATABASE IF EXISTS behavior_stats;
CREATE DATABASE behavior_stats;

\c behavior_stats;

CREATE EXTENSION CITEXT;

CREATE TABLE users 
(
    id TEXT PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    email CITEXT NOT NULL UNIQUE,
    passhash VARCHAR(500),
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    confirmation_code VARCHAR(255) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions 
(
    id SERIAL PRIMARY KEY,
    session_data TEXT,
    user_id TEXT,
    session_secret VARCHAR(255),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations
(
    id TEXT PRIMARY KEY,
    user_id TEXT,
    location_name TEXT
);

CREATE TABLE observation_settings
(
    id TEXT PRIMARY KEY,
    setting_name TEXT,
    location_id TEXT
);

CREATE TABLE patients
(
    id TEXT PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    location_id TEXT
);

-- STILL NEED TO ADD:
-- account
-- target behaviors
--- name
-- target behaviors to patients
-- behavior logs
--- patient
--- observation setting
--- date
--- score (int)
--- target behavior
-- treatment adjustments
--- patient
--- start date
--- note
--- type (do these need a table? - right now, I don't think so, just include an other option)

CREATE TABLE groups2users
(
    id SERIAL PRIMARY KEY,
    user_id TEXT,
    group_id TEXT,
    owning_user BOOLEAN DEFAULT FALSE
);

alter table user_sessions add FOREIGN KEY (user_id) REFERENCES users(id);
alter table locations add FOREIGN KEY (user_id) REFERENCES users(id);
alter table observation_settings add FOREIGN KEY (location_id) REFERENCES locations(id);
alter table groups2users add FOREIGN KEY (group_id) REFERENCES groups(id);


CREATE FUNCTION update_last_updated() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
$$;

CREATE FUNCTION update_group_next_check_in() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    NEW.next_check_in = CURRENT_DATE + check_in_frequency_days;
    RETURN NEW;
  END;
$$;

CREATE TRIGGER entries_last_updated_update BEFORE UPDATE ON entries FOR EACH ROW EXECUTE PROCEDURE update_last_updated();
