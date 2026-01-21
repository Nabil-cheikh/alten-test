INSERT INTO products (code, name, description, image, category, price, quantity, internal_reference, shell_id, inventory_status, rating, created_at, updated_at)
VALUES
('P001', 'Laptop Pro', 'High-performance laptop', 'laptop.jpg', 'Electronics', 1299.99, 50, 'INT-001', 1, 'INSTOCK', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('P002', 'Wireless Mouse', 'Ergonomic wireless mouse', 'mouse.jpg', 'Accessories', 29.99, 200, 'INT-002', 1, 'INSTOCK', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('P003', 'USB-C Hub', '7-in-1 USB-C hub', 'hub.jpg', 'Accessories', 49.99, 10, 'INT-003', 2, 'LOWSTOCK', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
