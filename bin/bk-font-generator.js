#! /usr/bin/env node

const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const program = require('commander')
const { checkNodeVer } = require('../lib/checkNodeVer.js')
const { handleError } = require('../lib/handleError.js')
const { generatorFiles } = require('../lib/generatorFiles.js')

checkNodeVer() // 检查 Node.js 版本

const options = {}

program
    .version(require('../package.json').version, '-v, --version', '查看插件版本')
    .usage('<path> <path> [options]')
    .option('-h, --help', '查看帮助')
    .option('-n, --name', '字体文件名称', (val) => { option.name = val})
    .option('-t, --types', '字体文件的种类，默认包括:["svg", "ttf", "woff", "woff2", "eot"]')
    .option('-o, --order', '使用字体格式的顺序，默认为:["eot", "woff2", "woff", "ttf", "svg"]')

program.parse(process.argv)

let [sourcePath, destPath] = program.args

if (sourcePath) {
    destPath = destPath || path.join(process.cwd(), 'bkfont/')
    
    fs.stat(sourcePath, (err, stat) => {
        if (err) {
            handleError(err)
        }
        
        let sourceFiles = []
        if (stat.isFile()) {
            if (path.extname(sourcePath) !== 'svg') {
                handleError('请传入合法的svg文件')
            }
            sourceFiles.push(path.join(sourcePath))
            generatorFiles(sourceFiles, destPath)
        } else {
            fs.readdir(sourcePath, (readErr, files) => {
                if (readErr) {
                    handleError(readErr)
                }
                files.forEach(file => {
                    if (path.extname(file) === '.svg') {
                        sourceFiles.push(path.join(sourcePath, file))
                    }
                })
                generatorFiles(sourceFiles, destPath)
            })
        }
    })
} else {
    handleError('请传入需要转换的源文件和输出目录')
}

