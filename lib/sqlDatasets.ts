export type SqlDatasetId = 'commerce';

export interface SqlDataset {
  id: SqlDatasetId;
  name: string;
  description: string;
  initialSql: string;
  defaultQuery: string;
}

const commerceInitialSql = `
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  signup_date TEXT NOT NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE order_items (
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL
);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  paid_at TEXT,
  amount REAL NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL
);

INSERT INTO users (id, name, city, signup_date) VALUES
  (1, 'Alice', 'Beijing', '2025-10-05'),
  (2, 'Bob', 'Shanghai', '2025-10-21'),
  (3, 'Charlie', 'Beijing', '2025-11-02'),
  (4, 'David', 'Shenzhen', '2025-11-15'),
  (5, 'Eve', 'Hangzhou', '2025-12-01'),
  (6, 'Frank', 'Shanghai', '2025-12-10'),
  (7, 'Grace', 'Beijing', '2026-01-03'),
  (8, 'Heidi', 'Shenzhen', '2026-01-12');

INSERT INTO products (id, name, category, price) VALUES
  (101, 'Mechanical Keyboard', 'Electronics', 599.0),
  (102, 'Noise Cancelling Headphones', 'Electronics', 899.0),
  (103, 'USB-C Cable', 'Electronics', 39.9),
  (104, 'Office Chair', 'Furniture', 1299.0),
  (105, 'Standing Desk', 'Furniture', 2499.0),
  (106, 'Coffee Beans 1kg', 'Grocery', 129.0),
  (107, 'Green Tea 200g', 'Grocery', 79.0),
  (108, 'Running Shoes', 'Sports', 699.0),
  (109, 'Yoga Mat', 'Sports', 159.0),
  (110, 'Notebook', 'Stationery', 12.5);

INSERT INTO orders (id, user_id, order_date, status) VALUES
  (1001, 1, '2025-12-05', 'PAID'),
  (1002, 1, '2026-01-08', 'PAID'),
  (1003, 2, '2025-12-20', 'CANCELLED'),
  (1004, 2, '2026-01-10', 'PAID'),
  (1005, 3, '2025-12-24', 'PAID'),
  (1006, 3, '2026-01-15', 'REFUNDED'),
  (1007, 4, '2025-12-30', 'PAID'),
  (1008, 5, '2026-01-02', 'PAID'),
  (1009, 6, '2026-01-05', 'PENDING'),
  (1010, 7, '2026-01-08', 'PAID'),
  (1011, 7, '2026-01-20', 'PAID'),
  (1012, 8, '2026-01-21', 'PAID');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1001, 101, 1, 599.0),
  (1001, 103, 2, 39.9),
  (1002, 106, 2, 129.0),
  (1002, 110, 3, 12.5),
  (1003, 102, 1, 899.0),
  (1004, 105, 1, 2499.0),
  (1004, 103, 1, 39.9),
  (1005, 107, 1, 79.0),
  (1005, 106, 1, 129.0),
  (1006, 104, 1, 1299.0),
  (1007, 108, 1, 699.0),
  (1007, 109, 2, 159.0),
  (1008, 110, 10, 12.5),
  (1009, 103, 5, 39.9),
  (1010, 101, 1, 599.0),
  (1010, 106, 1, 129.0),
  (1011, 102, 1, 899.0),
  (1011, 103, 1, 39.9),
  (1011, 110, 2, 12.5),
  (1012, 105, 1, 2499.0),
  (1012, 109, 1, 159.0);

INSERT INTO payments (id, order_id, paid_at, amount, method, status) VALUES
  (5001, 1001, '2025-12-05 10:12:00', 678.8, 'CARD', 'SUCCESS'),
  (5002, 1002, '2026-01-08 09:01:00', 295.5, 'WALLET', 'SUCCESS'),
  (5003, 1003, NULL, 899.0, 'CARD', 'FAILED'),
  (5004, 1004, '2026-01-10 18:22:00', 2538.9, 'CARD', 'SUCCESS'),
  (5005, 1005, '2025-12-24 14:20:00', 208.0, 'WALLET', 'SUCCESS'),
  (5006, 1006, '2026-01-15 12:10:00', 1299.0, 'CARD', 'REFUNDED'),
  (5007, 1007, '2025-12-30 21:05:00', 1017.0, 'CARD', 'SUCCESS'),
  (5008, 1008, '2026-01-02 08:00:00', 125.0, 'CARD', 'SUCCESS'),
  (5009, 1009, NULL, 199.5, 'WALLET', 'PENDING'),
  (5010, 1010, '2026-01-08 10:00:00', 728.0, 'CARD', 'SUCCESS'),
  (5011, 1011, '2026-01-20 19:30:00', 963.9, 'CARD', 'SUCCESS'),
  (5012, 1012, '2026-01-21 09:45:00', 2658.0, 'WALLET', 'SUCCESS');
`;

export const SQL_DATASETS: Record<SqlDatasetId, SqlDataset> = {
  commerce: {
    id: 'commerce',
    name: '电商订单（综合）',
    description: '包含用户、商品、订单、订单明细、支付。适合覆盖绝大多数 SQL 日常查询场景。',
    initialSql: commerceInitialSql,
    defaultQuery: 'SELECT * FROM users LIMIT 10;',
  },
};

