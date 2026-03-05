-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email) VALUES
    ('Alice Johnson', 'alice@techflow.com'),
    ('Bob Smith', 'bob@techflow.com'),
    ('Carol White', 'carol@techflow.com'),
    ('David Brown', 'david@techflow.com'),
    ('Eve Davis', 'eve@techflow.com');
