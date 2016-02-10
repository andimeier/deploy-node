var fs = require('fs-extra');

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