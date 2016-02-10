var exit = require('exit');
var log = require('./log');

/**
 * outputs an error message in red and the exits with an exit code of 1
 * @param message
 */
function die(message) {
    log.error(message);
    exit(1);
}

module.exports = exports = die;