const chalk = require('chalk')

module.exports.handleError = function (message) {
    console.log(chalk.red(message))
    process.exit(1)
}