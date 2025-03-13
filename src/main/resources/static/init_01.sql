-- Create schema
CREATE SCHEMA taskmanager;

-- Set schema usage
SET search_path TO taskmanager;

-- Create table within schema
CREATE TABLE taskmanager.tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    status VARCHAR(20),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data
INSERT INTO taskmanager.tasks (title, description, type, status, created_on) VALUES
('Fix login bug', 'Resolve the issue causing login failures for certain users.', 'Bug', 'Open', NOW() - INTERVAL '10 days'),
('Design homepage', 'Create a responsive design for the homepage.', 'Feature', 'WIP', NOW() - INTERVAL '5 days'),
('Database optimization', 'Improve query performance for large datasets.', 'Improvement', 'Completed', NOW() - INTERVAL '20 days'),
('Add dark mode', 'Implement a dark mode theme toggle.', 'Feature', 'Open', NOW() - INTERVAL '2 days'),
('Update dependencies', 'Upgrade outdated libraries and packages.', 'Maintenance', 'WIP', NOW() - INTERVAL '8 days');

SELECT * FROM taskmanager.tasks;
