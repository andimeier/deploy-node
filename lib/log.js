var chalk = require("chalk");

exports.log = function(message) {
  console.log(message);
};

exports.success = function(message) {
  console.log(chalk.green(message));
};

exports.info = function(message) {
  console.log(chalk.bold.white(message));
};

exports.warn = function(message) {
  console.log(chalk.yellow(message));
};

exports.error = function(message) {
  console.log(chalk.red(message));
};
