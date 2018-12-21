#! /usr/bin/env node

const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const program = require('commander')
const { checkNodeVer } = require('../lib/checkNodeVer.js')
const { handleError } = require('../lib/handleError.js')
const { generatorFiles } = require('../lib/generatorFiles.js')

checkNodeVer() // 检查 Node.js 版本

program
    .version(require('../package.json').version, '-v, --version', '查看插件版本')
    .usage('<path> <path> [options]')
    .option('-n, --name', 'font files name')
    .option('-t, --types', 'font files type，include:["svg", "ttf", "woff", "woff2", "eot"]')
    .option('-o, --order', 'font type order，default:["eot", "woff2", "woff", "ttf", "svg"]')

program.parse(process.argv)

let [sourcePath, destPath] = program.args

if (sourcePath) {
    destPath = destPath || path.join('bkiconfont')
    const fontPath = path.join(destPath, '/fonts/')
    fs.stat(sourcePath, (err, stat) => {
        if (err) {
            handleError(err)
        }
        
        const sourceFiles = []
        if (stat.isFile()) {
            if (path.extname(sourcePath) !== '.svg') {
                handleError('请传入合法的svg文件')
            }
            sourceFiles.push(path.join(sourcePath))
        } else {
            const files = fs.readdirSync(sourcePath)
            files.forEach(file => {
                if (path.extname(file) === '.svg') {
                    sourceFiles.push(path.join(sourcePath, file))
                }
            })
        }
        executeTransform(sourceFiles, fontPath)
    })
} else {
    handleError('请传入需要转换的svg图标文件和输出目录\n\n eg: bk-font-generator ./source/xx/ ./dist/')
}

function executeTransform (files, dest) {
    const fileLen = files.length
    console.log(chalk.green(`svg图标文件 ${fileLen} 个`))
    if (fileLen) {
        const options = getOptions(dest)
        generatorFiles(files, dest, options)
    } else {
        console.log(chalk.yellow('请传入需要转换的svg图标文件'))
    }
}

function getOptions (dest) {
    return {
        fontName: 'bkicon',
        css: true,
        cssDest: path.join(dest, '../demo.css'),
        cssTemplate: path.resolve(__dirname, '../templates/css.hbs'),
        cssFontsUrl: path.join('./fonts/'),
        html: true,
        htmlDest: path.join(dest, '../demo.html'),
        htmlTemplate: path.resolve(__dirname, '../templates/html.hbs'),
        templateOptions: {
            classPrefix: 'icon-',
            baseClassName: 'bk-icon'
        },
        types: ['svg', 'ttf', 'woff2', 'woff', 'eot'],
        order: ['svg', 'ttf', 'woff2', 'woff', 'eot']
    }
}

