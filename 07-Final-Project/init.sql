-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample orders
INSERT INTO orders (customer_name, product_id, quantity, status) VALUES
    ('John Doe', 1, 2, 'completed'),
    ('Jane Smith', 2, 1, 'shipped'),
    ('Bob Wilson', 3, 3, 'pending');
