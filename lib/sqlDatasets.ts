export type SqlDatasetId = 'commerce' | 'enterprise';

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

const enterpriseInitialSql = `
-- 部门表
CREATE TABLE departments (
  dept_id INTEGER PRIMARY KEY,
  dept_name TEXT NOT NULL,
  manager_id INTEGER,
  location TEXT
);

-- 职位表
CREATE TABLE jobs (
  job_id TEXT PRIMARY KEY,
  job_title TEXT NOT NULL,
  min_salary REAL,
  max_salary REAL
);

-- 员工表
CREATE TABLE employees (
  emp_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  hire_date TEXT,
  job_id TEXT,
  salary REAL,
  dept_id INTEGER,
  FOREIGN KEY (job_id) REFERENCES jobs(job_id),
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- 项目表
CREATE TABLE projects (
  proj_id INTEGER PRIMARY KEY,
  proj_name TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  budget REAL,
  status TEXT
);

-- 员工项目关系表
CREATE TABLE employee_projects (
  emp_id INTEGER,
  proj_id INTEGER,
  hours_spent INTEGER,
  role TEXT,
  PRIMARY KEY (emp_id, proj_id),
  FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
  FOREIGN KEY (proj_id) REFERENCES projects(proj_id)
);

-- 薪资调整日志
CREATE TABLE salary_history (
  history_id INTEGER PRIMARY KEY,
  emp_id INTEGER,
  old_salary REAL,
  new_salary REAL,
  change_date TEXT,
  reason TEXT,
  FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
);

-- 插入职位
INSERT INTO jobs VALUES ('CEO', 'Chief Executive Officer', 50000, 100000);
INSERT INTO jobs VALUES ('CTO', 'Chief Technology Officer', 40000, 80000);
INSERT INTO jobs VALUES ('DEV_LEAD', 'Senior Developer Lead', 30000, 60000);
INSERT INTO jobs VALUES ('DEV', 'Software Developer', 15000, 35000);
INSERT INTO jobs VALUES ('HR_MGR', 'HR Manager', 12000, 25000);
INSERT INTO jobs VALUES ('SALES_DIR', 'Sales Director', 20000, 50000);
INSERT INTO jobs VALUES ('QA', 'QA Engineer', 10000, 22000);

-- 插入部门
INSERT INTO departments VALUES (10, 'Executive', 1, 'Beijing');
INSERT INTO departments VALUES (20, 'Engineering', 2, 'Shanghai');
INSERT INTO departments VALUES (30, 'Sales', 6, 'Guangzhou');
INSERT INTO departments VALUES (40, 'Human Resources', 5, 'Shenzhen');
INSERT INTO departments VALUES (50, 'Marketing', NULL, 'Hangzhou');

-- 插入员工
INSERT INTO employees (emp_id, first_name, last_name, email, phone, hire_date, job_id, salary, dept_id) VALUES
(1, 'John', 'Doe', 'john.doe@enterprise.com', '13800000001', '2020-01-01', 'CEO', 95000, 10),
(2, 'Jane', 'Smith', 'jane.smith@enterprise.com', '13800000002', '2020-02-15', 'CTO', 75000, 20),
(3, 'Michael', 'Brown', 'm.brown@enterprise.com', '13800000003', '2021-03-10', 'DEV_LEAD', 55000, 20),
(4, 'Emily', 'Davis', 'e.davis@enterprise.com', '13800000004', '2022-05-20', 'DEV', 28000, 20),
(5, 'Sarah', 'Wilson', 's.wilson@enterprise.com', '13800000005', '2021-01-10', 'HR_MGR', 22000, 40),
(6, 'Chris', 'Evans', 'c.evans@enterprise.com', '13800000006', '2021-11-20', 'SALES_DIR', 45000, 30),
(7, 'David', 'Miller', 'd.miller@enterprise.com', '13800000007', '2023-01-15', 'DEV', 20000, 20),
(8, 'Mark', 'Taylor', 'm.taylor@enterprise.com', '13800000008', '2022-08-01', 'QA', 18000, 20),
(9, 'Lucy', 'Liu', 'l.liu@enterprise.com', '13800000009', '2023-04-01', 'QA', 15000, 20),
(10, 'Kevin', 'Durant', 'k.durant@enterprise.com', '13800000010', '2023-06-12', 'DEV', 19000, 50);

-- 插入项目
INSERT INTO projects VALUES (101, 'Apollo Project', '2023-01-01', '2023-12-31', 500000, 'COMPLETED');
INSERT INTO projects VALUES (102, 'Zeus Platform', '2023-06-01', '2024-06-30', 1200000, 'IN_PROGRESS');
INSERT INTO projects VALUES (103, 'Global Sales Expansion', '2024-01-15', '2024-12-31', 300000, 'PLANNING');
INSERT INTO projects VALUES (104, 'HR System Upgrade', '2024-02-01', '2024-05-31', 150000, 'IN_PROGRESS');

-- 插入项目参与关系
INSERT INTO employee_projects VALUES (2, 101, 150, 'Technical Architect');
INSERT INTO employee_projects VALUES (3, 101, 400, 'Tech Lead');
INSERT INTO employee_projects VALUES (4, 101, 800, 'Senior Developer');
INSERT INTO employee_projects VALUES (8, 101, 300, 'Lead QA');
INSERT INTO employee_projects VALUES (3, 102, 200, 'Architect');
INSERT INTO employee_projects VALUES (4, 102, 500, 'Backend Developer');
INSERT INTO employee_projects VALUES (7, 102, 600, 'Frontend Developer');
INSERT INTO employee_projects VALUES (10, 102, 450, 'Developer');
INSERT INTO employee_projects VALUES (6, 103, 100, 'Project Sponsor');
INSERT INTO employee_projects VALUES (5, 104, 200, 'HR Coordinator');

-- 插入薪资调整记录
INSERT INTO salary_history (emp_id, old_salary, new_salary, change_date, reason) VALUES
(4, 25000, 28000, '2023-07-01', 'Annual Performance Review'),
(7, 18000, 20000, '2023-12-15', 'Promotion to Mid-Level'),
(3, 50000, 55000, '2024-01-01', 'Market Adjustment');
`;

export const SQL_DATASETS: Record<SqlDatasetId, SqlDataset> = {
  commerce: {
    id: 'commerce',
    name: '电商订单（综合）',
    description: '包含用户、商品、订单、订单明细、支付。适合覆盖绝大多数 SQL 日常查询场景。',
    initialSql: commerceInitialSql,
    defaultQuery: 'SELECT * FROM users LIMIT 10;',
  },
  enterprise: {
    id: 'enterprise',
    name: '企业 ERP 系统',
    description: '包含员工、部门、职位、项目、项目分配、薪资历史等。支持复杂的多表联查 (JOIN) 与聚合分析。',
    initialSql: enterpriseInitialSql,
    defaultQuery: 'SELECT e.first_name, e.last_name, d.dept_name, j.job_title \nFROM employees e \nJOIN departments d ON e.dept_id = d.dept_id \nJOIN jobs j ON e.job_id = j.job_id;',
  },
};

