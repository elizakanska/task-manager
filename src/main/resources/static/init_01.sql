-- Drop schema and all related tables if they exist
DROP SCHEMA IF EXISTS taskmanager CASCADE;

-- Create schema
CREATE SCHEMA taskmanager;

-- Set schema usage
SET search_path TO taskmanager;

-- Create table within schema
CREATE TABLE users
(
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name  VARCHAR(100)
);

-- Create table for task types
CREATE TABLE task_types
(
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Create table for task statuses
CREATE TABLE task_statuses
(
  id   SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

-- Create table for tasks with foreign keys
CREATE TABLE tasks
(
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(100) NOT NULL,
  description TEXT,
  type_id     INT          NOT NULL,
  status_id   INT          NOT NULL,
  assignedTo     INT,
  created_on  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_task_type FOREIGN KEY (type_id) REFERENCES task_types (id) ON DELETE CASCADE,
  CONSTRAINT fk_task_status FOREIGN KEY (status_id) REFERENCES task_statuses (id) ON DELETE CASCADE,
  CONSTRAINT fk_task_user FOREIGN KEY (assignedTo) REFERENCES users (id) ON DELETE SET NULL

);

-- Insert dummy data
INSERT INTO users (username, password, first_name, last_name)
VALUES ('john_doe', 'password123', 'John', 'Doe'),
       ('jane_smith', 'password456', 'Jane', 'Smith'),
       ('alice_walker', 'password789', 'Alice', 'Walker');

-- Insert predefined task types
INSERT INTO task_types (name)
VALUES ('Bug'),
       ('Feature'),
       ('Improvement'),
       ('Maintenance'),
       ('Custom');

-- Insert predefined task statuses
INSERT INTO task_statuses (name)
VALUES ('Open'),
       ('WIP'),
       ('Completed');

-- Insert dummy tasks with correct foreign key references
INSERT INTO tasks (title, description, type_id, status_id, assignedTo, created_on)
VALUES ('Fix login bug', 'Resolve the issue causing login failures for certain users.',
        (SELECT id FROM task_types WHERE name = 'Bug'),
        (SELECT id FROM task_statuses WHERE name = 'Open'),
        (SELECT id FROM users WHERE username = 'john_doe'),
        NOW() - INTERVAL '10 days'),

       ('Design homepage', 'Create a responsive design for the homepage.',
        (SELECT id FROM task_types WHERE name = 'Feature'),
        (SELECT id FROM task_statuses WHERE name = 'WIP'),
        (SELECT id FROM users WHERE username = 'jane_smith'),
        NOW() - INTERVAL '5 days'),

       ('Database optimization', 'Improve query performance for large datasets.',
        (SELECT id FROM task_types WHERE name = 'Improvement'),
        (SELECT id FROM task_statuses WHERE name = 'Completed'),
        (SELECT id FROM users WHERE username = 'alice_walker'),
        NOW() - INTERVAL '20 days'),

       ('Add user authentication', 'Implement OAuth2 for user authentication.',
        (SELECT id FROM task_types WHERE name = 'Feature'),
        (SELECT id FROM task_statuses WHERE name = 'Open'),
        NULL,
        NOW() - INTERVAL '3 days'),

       ('Refactor API endpoints', 'Improve the structure of the REST API.',
        (SELECT id FROM task_types WHERE name = 'Improvement'),
        (SELECT id FROM task_statuses WHERE name = 'WIP'),
        NULL,
        NOW() - INTERVAL '7 days');

-- Verify inserted data
SELECT * FROM users;
SELECT * FROM task_types;
SELECT * FROM task_statuses;
SELECT * FROM tasks;
