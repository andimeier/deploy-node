var rimraf = require('rimraf');
var fs = require('fs-extra');
var die = require('./die');
var log = require('./log');
var fsUtils = require('./fsUtils');

/**
 * clears the build folder
 *
 * @param {string} folder folder to be rimrafed
 */
exports.clearBuildFolder = function (folder) {

    if (!folder) {
        die('no build folder configured.');
    }

    rimraf.sync(folder);

    log.log('cleaned build folder [' + folder + '].');
};


/**
 * copies all source files to the build folder
 *
 * @param {string} srcFolder the folder containing the source files
 * @param {string} buildFolder the target tfolder to which the files should be copied
 */
exports.copySourceFiles = function (srcFolder, buildFolder) {

    if (!srcFolder) {
        throw new Error('no source folder given. Script error.');
    }

    if (!buildFolder) {
        throw new Error('no build folder given. Script error.');
    }

    if (!fsUtils.isDir(srcFolder)) {
        die('source folder [' + srcFolder + '] is either not there or is no directory.');
    }

    fs.mkdirSync(buildFolder);
    fs.copySync(srcFolder, buildFolder);

    log.log('copied all source files from [' + srcFolder + '] to build folder [' + buildFolder + '].');
};
