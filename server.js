//dependencies
const inquirer = require("inquirer");
const connection = require("./db/connection.js");
//mySQL connection
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to Database.");
  trackerApplication();
});
//function to run application with prompt
let trackerApplication = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "prompt",
        message: "Please Choose a Selection",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add A Department",
          "Add A Role",
          "Add An Employee",
          "Update An Employee Role",
          "Log Out",
        ],
      },
    ])
    //if else statements for user's response into application
    .then((response) => {
      if (response.prompt === "View All Departments") {
        connection.query(`SELECT * FROM department`, (err, result) => {
          if (err) throw err;
          console.log("All Departments: ");
          console.table(result);
          trackerApplication();
        });
        //command if they choose view roles
      } else if (response.prompt === "View All Roles") {
        connection.query(
          `SELECT role.title, role.salary, role.department_id, department.name AS department_name FROM role JOIN department ON role.department_id = department.id`,
          (err, result) => {
            if (err) throw err;
            console.log("All Departments: ");
            console.table(result);
            trackerApplication();
          }
        );
        //command if they view employees
      } else if (response.prompt === "View All Employees") {
        connection.query(
          `SELECT employee.first_name, employee.last_name, employee.role_id, employee.manager_id, B.last_name AS manager_last_name, role.title, role.salary, role.department_id, department.name AS department_name FROM employee JOIN employee B ON employee.manager_id = b.id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id`,
          (err, result) => {
            if (err) throw err;
            console.log("Current Employees: ");
            console.table(result);
            trackerApplication();
          }
        );
        //command for add dept action, prompts user with new choices for response 
      } else if (response.prompt === "Add A Department") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "newDepartment",
              message: "Create New Department",
              validate: (createDepartment) => {
                if (createDepartment) {
                  return true;
                } else {
                  console.log("Please Create Department");
                  return false;
                }
              },
            },
          ])
          .then((response) => {
            connection.query(
              `INSERT INTO department (name) VALUES (?)`,
              [response.newDepartment],
              (err, result) => {
                if (err) throw err;
                console.log(`Created Department: ${response.newDepartment}.`);
                trackerApplication();
              }
            );
          });
          //command for add role response and function for user's added role
      } else if (response.prompt === "Add A Role") {
        connection.query(`SELECT * FROM department`, (err, result) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                type: "input",
                name: "role",
                message: "Name the role.",
                validate: (createRole) => {
                  if (createRole) {
                    return true;
                  } else {
                    console.log("Please create role");
                    return false;
                  }
                },
              },
              {
                type: "input",
                name: "salary",
                message: "Set role salary.",
                validate: (roleSalary) => {
                  if (roleSalary) {
                    return true;
                  } else {
                    console.log("Please input salary");
                    return false;
                  }
                },
              },
              {
                //where role goes
                type: "list",
                name: "departmentRole",
                message: "which department is this role for?",
                choices: () => {
                  var departmentList = [];
                  for (var i = 0; i < result.length; i++) {
                    departmentList.push(result[i].name);
                  }
                  return departmentList;
                },
              },
            ])
            //appends res to db
            .then((response) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].name === response.departmentRole) {
                  var department = result[i];
                }
              }
              console.log(response);
              connection.query(
                `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                [response.role, response.salary, department.id],
                (err, result) => {
                  if (err) throw err;
                  console.log(`${response.role}'s role has been updated`);
                  trackerApplication();
                }
              );
            });
        });
        //add employee command and prompts for user response
      } else if (response.prompt === "Add An Employee") {
        connection.query(`SELECT * FROM employee`, (err, result) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                type: "input",
                name: "firstName",
                message: "Enter employee's first name.",
                validate: (firstNameResponse) => {
                  if (firstNameResponse) {
                    return true;
                  } else {
                    console.log("Please enter name");
                    return false;
                  }
                },
              },
              {
                type: "input",
                name: "lastName",
                message: "Enter employee's last name.",
                validate: (lastNameResponse) => {
                  if (lastNameResponse) {
                    return true;
                  } else {
                    console.log("Please enter last name");
                    return false;
                  }
                },
              },
              {
                type: "list",
                name: "assignManager",
                message: "Assign manager.",
                choices: () => {
                  var obj = [];
                  for (var i = 0; i < result.length; i++) {
                    obj.push(result[i].last_name);
                  }
                  var newManagers = [...new Set(obj)];
                  return newManagers;
                },
              },
            ])
            //appends response to db
            .then((response) => {
              var firstName = response.firstName;
              var lastName = response.lastName;
              for (var i = 0; i < result.length; i++) {
                if (result[i].last_name === response.assignManager) {
                  var managerResponse = result[i];
                }
              }

              connection.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                //prompts user to add the employees first name, last name, role, and manager
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "roleUpdate",
                      message: "Enter employee role.",
                      choices: () => {
                        var employeeRoleArray = [];
                        for (var i = 0; i < result.length; i++) {
                          employeeRoleArray.push(result[i].title);
                        }
                        var newEmployeeRoleArray = [
                          ...new Set(employeeRoleArray),
                        ];
                        return newEmployeeRoleArray;
                      },
                    },
                  ])
                  //appends response to db
                  .then((response) => {
                    for (var i = 0; i < result.length; i++) {
                      if (result[i].title === response.roleUpdate) {
                        var roleUpdate = result[i];
                      }
                    }
                    connection.query(
                      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                      [firstName, lastName, roleUpdate.id, managerResponse.id],
                      (err, result) => {
                        if (err) throw err;
                        console.log(`${firstName} ${lastName} Has been added.`);
                        trackerApplication();
                      }
                    );
                  });
              });
            });
        });
        //command and prompts for updating roles
      } else if (response.prompt === "Update An Employee Role") {
        connection.query(`SELECT * FROM employee, role`, (err, result) => {
          if (err) throw err;
          //prompt to choose which employee were updating
          inquirer
            .prompt([
              {
                type: "list",
                name: "employee",
                message: "Choose an employee to update the role of.",
                choices: () => {
                  var updateEmployee = [];
                  for (var i = 0; i < result.length; i++) {
                    updateEmployee.push(result[i].last_name);
                  }
                  var newEmployeeUpdate = [...new Set(updateEmployee)];
                  return newEmployeeUpdate;
                },
              },
              {
                type: "list",
                name: "roleInput",
                message: "Enter new employee role",
                choices: () => {
                  var newRoleArray = [];
                  for (var i = 0; i < result.length; i++) {
                    newRoleArray.push(result[i].title);
                  }
                  var updatedRoleArray = [...new Set(newRoleArray)];
                  return updatedRoleArray;
                },
              },
            ])
            //append response to db
            .then((response) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].last_name === response.employee) {
                  var employeeName = result[i];
                }
              }

              for (var i = 0; i < result.length; i++) {
                if (result[i].title === response.roleInput) {
                  var employeeRole = result[i];
                }
              }

              connection.query(
                `UPDATE employee SET ? WHERE ?`,
                [
                  { role_id: employeeRole.id },
                  { last_name: employeeName.last_name },
                ],
                (err, result) => {
                  if (err) throw err;
                  console.log(`${employeeName.last_name}'s role has been updated.`);
                  trackerApplication();
                }
              );
            });
        });
        //closes session on log out
      } else if (response.prompt === "Log Out") {
        connection.end();
        console.log("Session ended.");
      }
    });
};
