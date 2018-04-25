// require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
// var keys = require("./keys.js");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Sdt#12887",
    database: "bamazon"
});

function whatToDo() {
    inquirer.prompt([
        {
            name: "toDo",
            type: "list",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ],
            message: "What would you like to do?"
        }
    ]).then(function (answer) {
        switch (answer.toDo) {
            case "View Products for Sale":
                forSale();
                break;

            case "View Low Inventory":
                lowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":

        }
    });
};

whatToDo();

function forSale() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + "; Product: " + res[i].product_name + "; Department: " + res[i].department_name + "; Price: $" + res[i].price + "; Quantity Available: " + res[i].stock_quantity);
        };
    });
};

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + "; Product: " + res[i].product_name + "; Department: " + res[i].department_name + "; Price: $" + res[i].price + "; Quantity Available: " + res[i].stock_quantity);
        };
    });
};

function addInventory() {
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Enter the ID of the item you would like to add to."
        },
        {
            name: "add",
            type: "input",
            message: "How many would you like to add to the inventory?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                else {
                    return false;
                };
            }
        }
    ]).then(function (answer) {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            var chosenProduct = "";
            for (var i = 0; i < res.length; i++) {
                if (res[i].id === parseInt(answer.item)) {
                    chosenProduct = res[i];
                };
            };
            var updatedQuantity = chosenProduct.stock_quantity + parseInt(answer.add);
            connection.query("UPDATE products SET stock_quantity=? WHERE id=?", [updatedQuantity, answer.item], function (err, res) {
                if (err) throw err;
                else {
                  console.log("You successfully added " + answer.add + " " + chosenProduct.product_name + "(s). The new stock quantity is " + chosenProduct.stock_quantity + ".");
                };
              });
        });
    });
};