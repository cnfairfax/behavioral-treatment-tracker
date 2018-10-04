DROP DATABASE IF EXISTS behavior_stats;
CREATE DATABASE behavior_stats;

\c behavior_stats;

CREATE EXTENSION CITEXT;

CREATE TABLE accounts
(
    id  TEXT PRIMARY KEY,
    account_name VARCHAR(255) UNIQUE,
    parent_user_id TEXT
);

CREATE TABLE users 
(
    id TEXT PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    email CITEXT NOT NULL UNIQUE,
    passhash VARCHAR(500),
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    confirmation_code VARCHAR(255) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_id TEXT
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
    account_id TEXT,
    parent_user_id TEXT,
    location_name VARCHAR(255)
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
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    location_id TEXT
);

CREATE TABLE target_behaviors
(
    id TEXT PRIMARY KEY,
    behavior_name VARCHAR(255),
    location_id TEXT,
    UNIQUE(behavior_name, location_id)
);

CREATE TABLE target_behaviors_2_patients
(
    id SERIAL PRIMARY KEY,
    patient_id TEXT,
    behavior_id TEXT
);

CREATE TABLE behavior_logs
(
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    observation_setting_id TEXT,
    score INTEGER CONSTRAINT zero_or_greater CHECK(score >= 0),
    target_behavior_id TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE adjustment_types
(
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(255) UNIQUE
);

CREATE TABLE treatment_adjustments
(
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    adjustment_note TEXT,
    adjustment_type_id INTEGER 
);

alter table user_sessions add FOREIGN KEY (user_id) REFERENCES users(id);

alter table observation_settings add FOREIGN KEY (location_id) REFERENCES locations(id);

alter table treatment_adjustments add FOREIGN KEY (adjustment_type_id) REFERENCES adjustment_types(id);
alter table treatment_adjustments add FOREIGN KEY (patient_id) REFERENCES patients(id);

alter table behavior_logs add FOREIGN KEY (patient_id) REFERENCES patients(id);
alter table behavior_logs add FOREIGN KEY (observation_setting_id) REFERENCES observation_settings(id);
alter table behavior_logs add FOREIGN KEY (target_behavior_id) REFERENCES target_behaviors(id);

alter table target_behaviors_2_patients add FOREIGN KEY (patient_id) REFERENCES patients(id);
alter table target_behaviors_2_patients add FOREIGN KEY (behavior_id) REFERENCES target_behaviors(id);

alter table target_behaviors add FOREIGN KEY (location_id) REFERENCES locations(id);

alter table patients add FOREIGN KEY (location_id) REFERENCES locations(id);

alter table observation_settings add FOREIGN KEY (location_id) REFERENCES locations(id);

alter table locations add FOREIGN KEY (parent_user_id) REFERENCES users(id);
alter table locations add FOREIGN KEY (account_id) REFERENCES accounts(id);

alter table users add FOREIGN KEY (account_id) REFERENCES accounts(id);

alter table accounts add FOREIGN KEY (parent_user_id) REFERENCES users(id);