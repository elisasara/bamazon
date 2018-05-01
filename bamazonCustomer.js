require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
// var keys = require("./keys.js");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.MySQL_Database_Password,
  database: "bamazon"
});

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
  inquirer.prompt([
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
        if (isNaN(value) === false) {
          return true;
        }
        else {
          return false;
        };
      }
    }
  ]).then(function (answer) {
    console.log(answer);
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
      var chosenProduct = "";
      for (var i = 0; i < res.length; i++) {
        if (res[i].id === parseInt(answer.item)) {
          chosenProduct = res[i];
        };
      };
      console.log(chosenProduct);
      var inStock = chosenProduct.stock_quantity - parseInt(answer.quantity);
      var sold = chosenProduct.product_sales + answer.quantity;
      console.log("New Quantity: " + inStock);
      if (inStock >= 0) {
        connection.query("UPDATE products SET stock_quantity=?, product_sales=? WHERE id=?", [inStock, sold, answer.item], function (err, res) {
          if (err) throw err;
          else {
            console.log("You successfully purchased " + answer.quantity + " " + chosenProduct.product_name + "(s) for a total cost of $" + chosenProduct.price * answer.quantity);
            buyAnother();
          }
        });
      }
      else {
        console.log("There is not enough of that item in stock.");
        buyAnother();
      };
    });
  });
};

function buyAnother() {
  inquirer.prompt([
    {
      name: "again",
      type: "confirm",
      message: "Do you want to purchase another item?"
    }
  ]).then(function (answer) {
    if (answer.again) {
      listItems();
    }
    else {
      console.log("Thank you for shopping with Bamazon!");
    };
  });
};