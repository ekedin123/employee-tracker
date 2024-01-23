INSERT INTO department (name)
VALUES ("executive"),
    ("development"),
    ("advertising"),
    ("contractor");

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 1000000, 1),
    ("CTO", 800000, 1),
    ("CFO", 850000, 1),
    ("development head", 500000, 2),
    ("development associate", 250000, 2),
    ("advertising lead", 450000, 3),
    ("advertising associate", 120000, 3),
    ("independent contractors", 150000, 4);

SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Pappy", "VanWinkle", 1, 1),
    ("Basil", "Hayden", 4, 1),
    ("Elmer", "Lee", 3, 1),
    ("E.H", "Taylor", 2, 1),
    ("Johnny", "Walker", 5, 1),
    ("Evan", "Williams", 7, 1),
    ("James", "Beam", 6, 1),
    ("Paul", "Masson", 8, 1);

SELECT * FROM employee;

