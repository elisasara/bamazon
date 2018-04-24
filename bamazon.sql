CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
id INTEGER NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INTEGER NOT NULL,
PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("T-Shirt", "Mens", 15.00, 25),
("T-Shirt", "Womens", 15.00, 25),
("Sweatshirt", "Children", 12.50, 20),
("Leggings", "Womens", 20.75, 15),
("Jeans", "Mens", 35.50, 15),
("Sweater", "Womens", 30.99, 12),
("Jacket", "Childrens", 19.99, 10),
("Hat", "Accessories", 10.00, 7),
("Sunglasses", "Accessories", 8.99, 5),
("Backpack", "Accessories", 17.50, 5);

SELECT * FROM products;