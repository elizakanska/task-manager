-- Drop schema and all related tables if they exist
DROP SCHEMA IF EXISTS taskmanager CASCADE;

-- Create schema
CREATE SCHEMA taskmanager;

-- Set schema usage
SET search_path TO taskmanager;

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
  created_on  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_task_type FOREIGN KEY (type_id) REFERENCES task_types (id) ON DELETE CASCADE,
  CONSTRAINT fk_task_status FOREIGN KEY (status_id) REFERENCES task_statuses (id) ON DELETE CASCADE
);

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
INSERT INTO tasks (title, description, type_id, status_id, created_on)
VALUES ('Fix login bug', 'Resolve the issue causing login failures for certain users.',
        (SELECT id FROM task_types WHERE name = 'Bug'),
        (SELECT id FROM task_statuses WHERE name = 'Open'),
        NOW() - INTERVAL '10 days'),

       ('Design homepage', 'Create a responsive design for the homepage.',
        (SELECT id FROM task_types WHERE name = 'Feature'),
        (SELECT id FROM task_statuses WHERE name = 'WIP'),
        NOW() - INTERVAL '5 days'),

       ('Database optimization', 'Improve query performance for large datasets.',
        (SELECT id FROM task_types WHERE name = 'Improvement'),
        (SELECT id FROM task_statuses WHERE name = 'Completed'),
        NOW() - INTERVAL '20 days'),

       ('Add dark mode', 'Implement a dark mode theme toggle.',
        (SELECT id FROM task_types WHERE name = 'Feature'),
        (SELECT id FROM task_statuses WHERE name = 'Open'),
        NOW() - INTERVAL '2 days'),

       ('Update dependencies', 'Upgrade outdated libraries and packages.',
        (SELECT id FROM task_types WHERE name = 'Maintenance'),
        (SELECT id FROM task_statuses WHERE name = 'WIP'),
        NOW() - INTERVAL '8 days');

-- Verify inserted data
SELECT * FROM task_types;
SELECT * FROM task_statuses;
SELECT * FROM tasks;
