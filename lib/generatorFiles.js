const path = require('path')
const webfontGenerator = require('webfonts-generator')
const chalk = require('chalk')
const handleError = require('./handleError')

module.exports.generatorFiles = function (sourceFiles, targetPath = './bkiconfont', options) {
    webfontGenerator({
        files: sourceFiles,
        dest: targetPath,
        ...options
    }, function (err) {
        if (err) {
            handleError(err)
        } else {
            console.log(chalk.green('转换成功!'))
        }
    })
}