-- Create schema
CREATE SCHEMA usermanager;

-- Set schema usage
SET search_path TO usermanager;

-- Create table within schema
CREATE TABLE usermanager.users
(
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name  VARCHAR(100)
);

-- Insert dummy data
INSERT INTO usermanager.users (username, password, first_name, last_name)
VALUES ('john_doe', 'password123', 'John', 'Doe'),
       ('jane_smith', 'password456', 'Jane', 'Smith'),
       ('alice_walker', 'password789', 'Alice', 'Walker');

-- Select all users to verify
SELECT *
FROM usermanager.users;
