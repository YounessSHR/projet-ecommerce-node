CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    country VARCHAR(50),
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category_id INT,
    stock INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Latest electronic gadgets and devices'),
('Fashion', 'Trendy clothing and accessories'),
('Home & Living', 'Furniture and home decor'),
('Sports & Outdoors', 'Sports equipment and outdoor gear'),
('Books', 'Books of all genres'),
('Beauty & Health', 'Beauty products and health items'),
('Toys & Games', 'Entertainment for all ages'),
('Automotive', 'Car accessories and parts');

-- Insert products
INSERT INTO products (name, description, price, image_url, category_id, stock) VALUES
-- Electronics
('MacBook Pro M2', '14-inch MacBook Pro with M2 chip', 1499.99, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500', 1, 20),
('iPhone 15 Pro', 'Latest iPhone with pro camera system', 999.99, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500', 1, 30),
('Sony WH-1000XM4', 'Premium noise-cancelling headphones', 349.99, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500', 1, 25),
('Samsung QLED TV', '65-inch 4K Smart TV', 1299.99, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=500', 1, 15),

-- Fashion
('Leather Jacket', 'Classic black leather jacket', 199.99, 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=500', 2, 40),
('Running Shoes', 'Comfortable athletic shoes', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500', 2, 50),
('Designer Handbag', 'Luxury leather handbag', 299.99, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500', 2, 20),
('Sunglasses', 'Polarized UV protection sunglasses', 129.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500', 2, 35),

-- Home & Living
('Modern Sofa', 'Contemporary 3-seater sofa', 899.99, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500', 3, 10),
('Smart LED Lamp', 'WiFi-enabled mood lighting', 79.99, 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=500', 3, 30),
('Coffee Maker', 'Programmable coffee machine', 149.99, 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?auto=format&fit=crop&w=500', 3, 25),
('Bed Set', 'Queen size luxury bedding set', 199.99, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500', 3, 20),

-- Sports & Outdoors
('Mountain Bike', 'All-terrain mountain bicycle', 599.99, 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=500', 4, 15),
('Yoga Mat', 'Non-slip exercise yoga mat', 29.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=500', 4, 40),
('Tennis Racket', 'Professional tennis racket', 159.99, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=500', 4, 25),
('Camping Tent', '4-person waterproof tent', 249.99, 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=500', 4, 20),

-- Books
('Best Seller Novel', 'Latest fiction bestseller', 24.99, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500', 5, 50),
('Cookbook', 'International recipes collection', 34.99, 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=500', 5, 30),
('Self-Help Book', 'Personal development guide', 19.99, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500', 5, 40),
('Art Book', 'Contemporary art collection', 49.99, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=500', 5, 25),

-- Beauty & Health
('Face Cream', 'Anti-aging moisturizer', 39.99, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500', 6, 40),
('Hair Dryer', 'Professional salon hair dryer', 89.99, 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=500', 6, 25),
('Vitamin Set', 'Daily vitamin supplements', 29.99, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500', 6, 50),
('Essential Oils', 'Aromatherapy oil set', 49.99, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500', 6, 30),

-- Toys & Games
('Board Game', 'Family strategy game', 44.99, 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=500', 7, 35),
('RC Drone', 'Remote control camera drone', 299.99, 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=500', 7, 20),
('LEGO Set', 'Building blocks collection', 79.99, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=500', 7, 30),
('Puzzle', '1000-piece jigsaw puzzle', 24.99, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500', 7, 40),

-- Automotive
('Car Vacuum', 'Portable car vacuum cleaner', 59.99, 'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?auto=format&fit=crop&w=500', 8, 30),
('Car Speaker Set', 'Premium car audio system', 399.99, 'https://images.unsplash.com/photo-1558537348-c0f8e733989d?auto=format&fit=crop&w=500', 8, 20),
('Dash Cam', 'HD dashboard camera', 149.99, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=500', 8, 25),
('Car Care Kit', 'Complete auto detailing kit', 89.99, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=500', 8, 35);
