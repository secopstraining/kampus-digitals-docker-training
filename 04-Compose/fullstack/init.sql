-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email) VALUES
    ('Alice Johnson', 'alice@kampusdigitals.com'),
    ('Bob Smith', 'bob@kampusdigitals.com'),
    ('Carol White', 'carol@kampusdigitals.com'),
    ('David Brown', 'david@kampusdigitals.com'),
    ('Eve Davis', 'eve@kampusdigitals.com');
