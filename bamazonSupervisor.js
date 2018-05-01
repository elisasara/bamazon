require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: process.env.MySQL_Database_Password,
    database: "bamazon"
});

// function to start program
function whatToDo() {
    inquirer.prompt([
        {
            name: "toDo",
            type: "list",
            choices: [
                "View Product Sales by Department",
                "Create New Department"
            ],
            message: "What would you like to do?"
        }
    ]).then(function (answer) {
        switch (answer.toDo) {
            case "View Product Sales by Department":
                salesByDept();
                break;

            case "Create New Department":
                newDept();
        };
    });
};

whatToDo();

// function to view all departments
function salesByDept() {
    // connect to database
    connection.query("SELECT departments.department_id AS department_id, departments.department_name AS department_name, departments.over_head_costs AS over_head_costs, products.product_sales AS product_sales FROM departments LEFT JOIN products ON departments.department_name=products.department_name", function (err, res) {
        if (err) throw err;
        else {
            // create table
            var table = new Table({
                head: ["department_id", "department_name", "over_head_costs", "product_sales", "total_profit"],
                colWidths: [15, 18, 18, 15, 15]
            });
    // TODO: CREATE LOGIC TO REMOVE DUPLICATE ROWS
            var deptArr = [];
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_sales === null) {
                    res[i].product_sales = 0.00;
                }
                if (deptArr.indexOf(res[i].department_id)<0){
                    deptArr.push(res[i].department_id);
                    var totalProfit = res[i].product_sales - res[i].over_head_costs;
    
                    table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, totalProfit]);     
                }
            };
            console.log(table.toString());
            nextToDo();
        }
    });
}

// function to create new department
function newDept() {
    inquirer.prompt([
        {
            name: "deptName",
            type: "input",
            message: "What department would you like to create?"
        },
        {
            name: "deptId",
            type: "input",
            message: "Please enter the ID of the department (4 letters max.)"
        },
        {
            name: "overhead",
            type: "input",
            message: "How much is the over head cost of the department?",
            validate: function (value) {
                if (isNaN(value) === false) {
                  return true;
                }
                else {
                  return false;
                };
              }
        }
    ]).then(function (answer){
        connection.query("INSERT INTO departments (department_id, department_name, over_head_costs) VALUES (?)", [[answer.deptId, answer.deptName, answer.overhead]], function (err, res){
            if (err) throw err;
            else {
                console.log(answer.deptName + " added.");
                nextToDo();
            };
        });
    });
};

// function to see what is next 
function nextToDo() {
    inquirer.prompt([
        {
            name: "next",
            type: "confirm",
            message: "Do you want to perform another action?"
        }
    ]).then(function(answer){
        if (answer.next) {
            whatToDo();
        }
        else {
            console.log("Have a good day!");
        };
    });
};