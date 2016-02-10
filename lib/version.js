var jsonfile = require('jsonfile');
var log = require('./log');
var fsUtils = require('./fsUtils');


/**
 * adds file containing version info
 *
 * @param {string} filename file name of the version file (including path)
 */
exports.createVersionsFile = function (filename) {
    var version;

    if (fsUtils.isFile(filename)) {
        version = jsonfile.readFileSync(filename, { throws: false });
    }

    if (!version) {
        // start from scratch
        version = {};
    }


    version.buildDate = (new Date()).toISOString();


    jsonfile.writeFileSync(filename, version);
    log.log('added version file ' + filename);
};