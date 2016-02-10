var jsonfile = require('jsonfile');
var log = require('./log');
var fsUtils = require('./fsUtils');


/**
 * adds file containing version info. An already existing JSON file will be augmented, IOW, the properties
 * 'buildDate' and 'message' (if given) will be overwritten, all other properties will be retained.
 *
 * @param {string} filename file name of the version file (including path)
 * @param {string} message optional message to be written to the versions file
 */
exports.createVersionsFile = function (filename, message) {
    var version;

    if (fsUtils.isFile(filename)) {
        version = jsonfile.readFileSync(filename, {throws: false});
    }

    if (!version) {
        // start from scratch
        version = {};
    }


    version.buildDate = (new Date()).toISOString();
    if (message) {
        version.message = message;
    }

    jsonfile.writeFileSync(filename, version, { spaces: 2 });
    log.log('added version file ' + filename);
};