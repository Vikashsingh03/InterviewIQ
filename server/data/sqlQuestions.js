const SQL_SCHEMA_SQL = `
CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department_id INTEGER NOT NULL, salary INTEGER NOT NULL, hire_date TEXT NOT NULL);
CREATE TABLE orders (id INTEGER PRIMARY KEY, employee_id INTEGER NOT NULL, amount INTEGER NOT NULL, order_date TEXT NOT NULL);
INSERT INTO departments (id, name) VALUES (1, 'Engineering'), (2, 'Sales'), (3, 'Marketing'), (4, 'Support');
INSERT INTO employees (id, name, department_id, salary, hire_date) VALUES
(1, 'Aarav Sharma', 1, 95000, '2021-03-15'),
(2, 'Priya Patel', 1, 88000, '2020-07-22'),
(3, 'Rohan Verma', 1, 72000, '2022-01-10'),
(4, 'Sneha Iyer', 1, 105000, '2019-11-05'),
(5, 'Vikram Singh', 2, 68000, '2021-06-30'),
(6, 'Ananya Das', 2, 74000, '2020-02-14'),
(7, 'Karan Mehta', 2, 59000, '2023-04-01'),
(8, 'Divya Nair', 3, 62000, '2021-09-12'),
(9, 'Arjun Rao', 3, 66000, '2022-08-19'),
(10, 'Ishita Bose', 4, 55000, '2023-02-27'),
(11, 'Aditya Kumar', 4, 58000, '2021-12-08'),
(12, 'Meera Joshi', 1, 92000, '2020-10-03');
INSERT INTO orders (id, employee_id, amount, order_date) VALUES
(1, 5, 12000, '2024-01-05'),
(2, 5, 8000, '2024-02-11'),
(3, 6, 15000, '2024-01-20'),
(4, 6, 5000, '2024-03-02'),
(5, 7, 3000, '2024-02-14'),
(6, 8, 9000, '2024-01-28'),
(7, 9, 11000, '2024-03-10'),
(8, 9, 4000, '2024-03-15'),
(9, 1, 21000, '2024-02-20'),
(10, 4, 25000, '2024-01-15'),
(11, 6, 7000, '2024-03-22'),
(12, 10, 6000, '2024-02-08');
`;
const SQL_QUESTION_BANK = [
  {
    id: "sql-basic-filter",
    title: "High earners",
    description: "List the name and salary of every employee earning more than 70000. Return exactly two columns: name and salary.",
    difficulty: "easy",
    ordered: false,
    expectedColumns: ["name", "salary"],
    expectedRows: [
      { name: "Aarav Sharma", salary: 95000 },
      { name: "Priya Patel", salary: 88000 },
      { name: "Rohan Verma", salary: 72000 },
      { name: "Sneha Iyer", salary: 105000 },
      { name: "Ananya Das", salary: 74000 },
      { name: "Meera Joshi", salary: 92000 }
    ]
  },
  {
    id: "sql-count-group",
    title: "Headcount per department",
    description: "For each department, count how many employees it has. Return exactly two columns: name (the department name) and employee_count.",
    difficulty: "easy",
    ordered: false,
    expectedColumns: ["name", "employee_count"],
    expectedRows: [
      { name: "Engineering", employee_count: 5 },
      { name: "Sales", employee_count: 3 },
      { name: "Marketing", employee_count: 2 },
      { name: "Support", employee_count: 2 }
    ]
  },
  {
    id: "sql-join-orders",
    title: "Employees with orders",
    description: "List the names of employees who have placed at least one order. Use a JOIN. Return exactly one column: name, with each name appearing only once.",
    difficulty: "medium",
    ordered: false,
    expectedColumns: ["name"],
    expectedRows: [
      { name: "Vikram Singh" },
      { name: "Ananya Das" },
      { name: "Karan Mehta" },
      { name: "Divya Nair" },
      { name: "Arjun Rao" },
      { name: "Aarav Sharma" },
      { name: "Sneha Iyer" },
      { name: "Ishita Bose" }
    ]
  },
  {
    id: "sql-second-highest",
    title: "Second highest salary",
    description: "Find the second highest salary among all employees. Return exactly one column: salary.",
    difficulty: "medium",
    ordered: false,
    expectedColumns: ["salary"],
    expectedRows: [{ salary: 95000 }]
  },
  {
    id: "sql-having",
    title: "Large departments",
    description: "List departments with more than 2 employees, along with the employee count. Return exactly two columns: name and employee_count.",
    difficulty: "medium",
    ordered: false,
    expectedColumns: ["name", "employee_count"],
    expectedRows: [
      { name: "Engineering", employee_count: 5 },
      { name: "Sales", employee_count: 3 }
    ]
  },
  {
    id: "sql-top-per-group",
    title: "Top earner per department",
    description: "For each department, find the employee with the highest salary. Return exactly three columns: department_name, employee_name, salary.",
    difficulty: "hard",
    ordered: false,
    expectedColumns: ["department_name", "employee_name", "salary"],
    expectedRows: [
      { department_name: "Engineering", employee_name: "Sneha Iyer", salary: 105000 },
      { department_name: "Sales", employee_name: "Ananya Das", salary: 74000 },
      { department_name: "Marketing", employee_name: "Arjun Rao", salary: 66000 },
      { department_name: "Support", employee_name: "Aditya Kumar", salary: 58000 }
    ]
  },
  {
    id: "sql-above-avg",
    title: "Above department average",
    description: "Find employees whose salary is above the average salary of their own department. Return exactly two columns: name and salary.",
    difficulty: "hard",
    ordered: false,
    expectedColumns: ["name", "salary"],
    expectedRows: [
      { name: "Aarav Sharma", salary: 95000 },
      { name: "Sneha Iyer", salary: 105000 },
      { name: "Meera Joshi", salary: 92000 },
      { name: "Vikram Singh", salary: 68000 },
      { name: "Ananya Das", salary: 74000 },
      { name: "Arjun Rao", salary: 66000 },
      { name: "Aditya Kumar", salary: 58000 }
    ]
  },
  {
    id: "sql-top-spenders",
    title: "Top 3 by order value",
    description: "List the top 3 employees by total order amount. Return exactly two columns: name and total_amount, ordered by total_amount descending.",
    difficulty: "hard",
    ordered: true,
    expectedColumns: ["name", "total_amount"],
    expectedRows: [
      { name: "Ananya Das", total_amount: 27000 },
      { name: "Sneha Iyer", total_amount: 25000 },
      { name: "Aarav Sharma", total_amount: 21000 }
    ]
  }
];
export { SQL_SCHEMA_SQL, SQL_QUESTION_BANK };
