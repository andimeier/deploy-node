var rimraf = require('rimraf');
var fs = require('fs');
var die = require('./die');
var log = require('./log');

/**
 * clears the build folder
 *
 * @param {string} folder folder to be rimrafed
 */
exports.clearBuildFolder = function (folder) {

    log.log('asdf');

    if (!folder) {
        log.log('ooops');
        die('No build folder configured.');
    }

    log.warn('rimrafing ' + folder);
    //rimraf.sync(folder);
    fs.mkdirSync(folder);

    log.log('cleaned build folder [' + folder + '.');
};
