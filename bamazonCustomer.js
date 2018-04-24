// import { F_OK } from "constants";

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

console.log("bamazon is running!");

function listItems() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("ID: " + res[i].id + "; Product: " + res[i].product_name + "; Department: " + res[i].department_name + "; Price: $" + res[i].price + "; Quantity Available: " + res[i].stock_quantity);
    };
    chooseItem();
  });
};

listItems();

function chooseItem() {
  inquirer.prompt(
    {
      name: "item",
      type: "input",
      message: "Enter the ID of the item you would like to purchase."
    },
    {
      name: "quantity",
      type: "input",
      message: "How many would you like to order?",
      validate: function (value) {
        if (isNAN(value) === false) {
          return true;
        }
        else {
          return false;
        };
      }
    }
  ).then(function (answer) {
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
      var chosenProduct;
      for (var i = 0; i < res.length; i++) {
        if (results[i].id === parseInt(answer.item)) {
          chosenProduct = results[i];
        };
      };
      if ((chosenProduct.stock_quantity - answer.quantity) >= 0) {
        connection.query("UPDATE products SET stock_quantity=" + chosenProduct.stock_quantity + "-? WHERE" + chosenProduct.id + "=?", [parseInt(answer.quantity), parseInt(answer.item)], function (err, res) {
          console.log("You successfully purchased " + answer.quantity + " " + chosenProduct.product_name + "(s) for a total cost of $" + chosenProduct.price * answer.quantity);
        });
      }
      else {
        console.log("There is not enough of that item in stock.");
      };
    });
  });
};