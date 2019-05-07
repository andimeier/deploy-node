var fs = require('fs-extra');
var shell = require('shelljs');
var path = require('path');
var fsUtils = require('./fsUtils');
var log = require('./log');

/**
 * install npm dependencies
 *
 * @param {string} buildFolder the target tfolder to which the files should be copied
 */
exports.installDependencies = function (buildFolder) {
    var srcPackageJson = './package.json';
    var buildPackageJson;


    if (!fsUtils.isFile(srcPackageJson)) {
        die(srcPackageJson + ' not found.');
    }

    buildPackageJson = path.join(buildFolder, srcPackageJson);
    
    log.log('installing productive NPM packages ...');

    // make sure npm finds all infos in the build directory (package.json)
    fs.copySync('./package.json', buildPackageJson);

    if (shell.exec('cd ' + buildFolder + ' && npm install --production').code !== 0) {
        die('npm install failed.');
    }

    log.log('installed NPM packages.');

    // remove copy of package.json again, and also the now generated package-lock.json
    fs.unlinkSync(buildPackageJson);
    fs.unlinkSync(path.join(buildFolder, srcPackageLockJson));

    log.log('removed ' + buildPackageJson);
};