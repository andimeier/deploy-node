var rimraf = require('rimraf');
var fs = require('fs-extra');
var shell = require('shelljs');
var targz = require('node-tar.gz');
var die = require('./die');
var log = require('./log');
var fsUtils = require('./fsUtils');

/**
 * clears the build base folder
 *
 * @param {string} folder folder to be rimrafed
 */
exports.clearBuildBaseFolder = function (folder) {

    if (!folder) {
        die('no build folder configured.');
    }

    rimraf.sync(folder);

    log.log('cleaned build base folder [' + folder + '].');
};


/**
 * copies all source files to the build folder
 *
 * @param {string} srcFolder the folder containing the source files
 * @param {string} buildFolder the target folder to which the files should be copied
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

    fs.mkdirsSync(buildFolder);
    fs.copySync(srcFolder, buildFolder);

    log.log('copied all source files from [' + srcFolder + '] to build folder [' + buildFolder + '].');
};


/**
 * packages the build folder into a tar file. This is the deployment package to be deployed.
 *
 * @param {string} buildFolder the folder to be packed into the targz file
 * @param {string} deploymentFile the filename of the resulting targz file (deployment package file)
 * @param {function} callback will be called on success
 */
exports.package = function (buildFolder, deploymentFile, callback) {
    var tarFile;

    tarFile = deploymentFile;

    log.log('tarring deployment folder [' + buildFolder + '] to ' + tarFile + ' ...');


    targz().compress(buildFolder, tarFile, function (err) {
        if (err) {
            log.error('error at targz\'ing the build folder', err.stack);
            die('error at targz\'ing');
        }

        log.log('deployment package created: ' + tarFile);
        callback(null);
    });
};