/**
 * Created by z003d5bd on 10.02.2016.
 */
var commandLineArgs = require('command-line-args');
var camelCase = require('camelcase');
var chalk = require('chalk');
var _ = require('lodash');
var exit = require('exit');


// the command line options
var argsConfig = [
    { name: 'verbose', alias: 'v', type: Boolean, description: 'verbose output' },
    { name: 'message', alias: 'm', type: String, typeLabel: '[underline]{message}', description: 'deployment message' },
    { name: 'timestamp', type: Boolean, description: 'add timestamp to filename of output file' },
    { name: 'list-commits', alias: 'l', type: Number, typeLabel: '[underline]{commits}', description: 'list the last [underline]{[commits]} commits' },
    { name: 'detect-config-changes', type: Boolean, description: 'warn if the config files have changed since the last tagged version' },
    { name: 'print-last-commit', type: Boolean, description: 'print the log message of the last commit' },
    { name: 'workdir-clean', type: Boolean, description: 'warn if the work directory is dirty' },
    { name: 'tag', alias: 't', type: TagType, typeLabel: '[underline]{tag_type}', description: 'specify the type of Git tag to be set. [underline]{[tag_type]} can be either "lightweight" or "annotated" (or any abbreviation of these terms). If this parameter is not provided, no Git tag will be created.' },
    { name: 'version-file', type: String, typeLabel: '[underline]{filename}', description: 'file name of version file to be written' },
    { name: 'batch', alias: 'b', type: Boolean, description: 'enable batch mode. There are no interactions, no user confirmations etc. Suitable for e.g. a build triggered by a CI server' },
    //{ name: 'config', alias: 'c', type: Boolean },
    { name: 'build-folder', alias: 'o', typeLabel: '[underline]{folder}', type: String, description: 'folder in which the build takes place. The contents of this folder will then be packaged to the output file.' },
    { name: 'help', alias: 'h', type: Boolean, description: 'display this help message' }
];


/**
 * custom options parser for git tag type. If the given value starts is annotated or a part of it, it is 'annotated',
 * if the given value is 'lightweight' or starts likewise, it is 'lightweight'
 *
 * The normalized tagType is either 'annotated' or 'lightweight'
 */
function TagType (type) {
    var normalized = type;

    [ 'annotated', 'lightweight' ].some (function (t) {
        if (typeof type === 'string' && t.substr(0, type.length) === type) {
            normalized = t;
            return true;
        }
    });

    return normalized;
}


/**
 * @errors {array} array of error strings
 */
function printErrors(errors) {
    errors.forEach(function (error) {
        console.log(chalk.red(error));
    });
    console.log('Call with -h / --help to see usage info.');
}

/**
 * prints the usage
 */
function printUsage() {
    console.log(commandLineArgs(argsConfig).getUsage({
        title: 'Deployment script for node and Angular apps.'
    }));
}


/**
 * @param {object} argsConfig configuration of command line arguments, s. https://www.npmjs.com/package/command-line-args for details
 * @return {object} the parsed options
 */
exports.parseCommandLineArgs = function () {
    var options;
    var errors = [];


    options = commandLineArgs(argsConfig).parse();

    // convert all options to camel case
    options = _.mapKeys(options, function (dummy, key) {
        return camelCase(key);
    });

    // check options
    if (_.has(options, 'tag') && [ 'annotated', 'lightweight' ].indexOf(options.tag) === -1) {
        errors.push('parameter tag must have values "annotated" or "lightweight", but is: ' + options.tag);
    }


    if (options.help) {
        printUsage();
        exit(0);
    }

    if (errors.length) {
        printErrors(errors);
        exit(1);
    }

    return options;
};