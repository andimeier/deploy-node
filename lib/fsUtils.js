var fs = require('fs-extra');
var moment = require('moment');

/**
 * checks if a given dir exists and is a directory
 * @param {string} folder folder name to be tested
 * @return {boolean} true if directory exists and is a directory, false otherwise
 */
exports.isDir = function(folder) {
    var stats;

    try {
        stats = fs.statSync(folder);
    } catch (e) {
        return false;
    }

    return stats.isDirectory();
};


/**
 * checks if a given file exists and is a regular file
 * @param {string} file file name to be tested
 * @return {boolean} true if file exists and is a regular file, false otherwise
 */
exports.isFile = function(file) {
    var stats;

    try {
        stats = fs.statSync(file);
    } catch (e) {
        return false;
    }

    return stats.isFile();
};


/**
 * assembles the filename of the deployment package file (e.g. 'projectname_1.0.0-alpha+20160101120000'). Note that
 * there is no extension because the app will first be built in a directory of that name, afterwards this directory
 * is getting targz'ed. So the resulting deployment package file actually has the name
 * projectname_1.0.0-alpha+20160101120000.tar.gz in this example.
 *
 * @param {string} projectName name of the project
 * @param {string} version version string
 * @param {boolean} includeTimestamp if true, the timestamp will be appended to the version as part of the filename
 * @return {string} the dirname of the deployment package directory
 */
exports.getPackageDirname = function (projectName, version, includeTimestamp) {
    var dirname;
    var timestamp;

    if (version) {
        version = 'v' + version;
    }

    if (includeTimestamp) {
        timestamp = moment().format('YYYYMMDD-HHmmss');

        if (version) {
            // append timestamp according after a plus sign according to semver rules
            version = `${version}+${timestamp}`;
        } else {
            // only timestamp, no version
            version = timestamp;
        }
    }

    dirname = projectName
        + (version ? '_' + version : '');

    return dirname;
};