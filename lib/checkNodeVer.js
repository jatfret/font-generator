const semver = require('semver')
const { handleError } = require('./handleError.js')
const nodeVersion = require('../package.json').engines.node

module.exports.checkNodeVer = function () {
    if (!semver.satisfies(process.version, nodeVersion)) {
        const message = '当前Node.js版本为' + process.version + ', 本插件要求Node.js版本需要大于' + nodeVersion + '。\n' +
                        '请升级你的 Node.js 版本。'

        handleError(message)
    }
}