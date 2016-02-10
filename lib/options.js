/**
 * Created by z003d5bd on 10.02.2016.
 */
var commandLineArgs = require('command-line-args');
var camelCase = require('camelcase');
var chalk = require('chalk');
var _ = require('lodash');
var exit = require('exit');
var fs = require('fs');


// the command line options
var argsConfig = [
    {name: 'verbose', alias: 'v', type: Boolean, description: 'Verbose output'},
    {name: 'message', alias: 'm', type: String, typeLabel: '[underline]{message}', description: 'Deployment message'},
    {name: 'timestamp', type: Boolean, description: 'Add timestamp to filename of output file'},
    {
        name: 'list-commits',
        alias: 'l',
        type: Number,
        typeLabel: '[underline]{commits}',
        description: 'List the last [underline]{[commits]} commits'
    },
    {
        name: 'detect-config-changes',
        type: Boolean,
        description: 'Warn if the config files have changed since the last tagged version'
    },
    {name: 'print-last-commit', type: Boolean, description: 'Print the log message of the last commit'},
    {name: 'workdir-clean', type: Boolean, description: 'Warn if the work directory is dirty'},
    {
        name: 'tag',
        alias: 't',
        type: TagType,
        typeLabel: '[underline]{tag_type}',
        description: 'Specify the type of Git tag to be set. [underline]{[tag_type]} can be either "lightweight" or '
            + '"annotated" (or any abbreviation of these terms). '
            + 'If this parameter is not provided, no Git tag will be created.'
    },
    {
        name: 'version-file',
        type: String,
        typeLabel: '[underline]{filename}',
        description: 'File name of version file to be written'
    },
    {
        name: 'batch',
        alias: 'b',
        type: Boolean,
        description: 'Enable batch mode. '
            + 'There are no interactions, no user confirmations etc. '
            + 'Suitable for e.g. a build triggered by a CI server'
    },
    //{ name: 'config', alias: 'c', type: Boolean },
    {
        name: 'build-folder',
        alias: 'o',
        typeLabel: '[underline]{folder}',
        type: String,
        description: 'Folder in which the build takes place. '
        + 'The contents of this folder will then be packaged to the output file. '
        + "This parameter is mandatory."
    },
    {name: 'help', alias: 'h', type: Boolean, description: 'Display this help message'}
];


/**
 * custom options parser for git tag type. If the given value starts is annotated or a part of it, it is 'annotated',
 * if the given value is 'lightweight' or starts likewise, it is 'lightweight'
 *
 * The normalized tagType is either 'annotated' or 'lightweight'
 */
function TagType(type) {
    var normalized = type;

    ['annotated', 'lightweight'].some(function (t) {
        if (typeof type === 'string' && t.substr(0, type.length) === type) {
            normalized = t;
            return true;
        }
    });

    return normalized;
}


/**
 * display all collected errors
 *
 * @errors {array} array of error strings
 */
function printErrors(errors) {
    errors.forEach(function (error) {
        console.log(chalk.red(error));
    });
    console.log('Call with -h / --help to see usage info.');
}

/**
 * prints the usage info
 */
function printUsage() {
    console.log(commandLineArgs(argsConfig).getUsage({
        title: 'deploy.js',
        description: 'Deployment script for node and Angular apps.'
    }));
}


/**
 * parses the command line parameters, validates options, adds default options etc. The result is a valid options
 * object which can be used in the script without further checking. All validations should have been done by this
 * function already.
 *
 * @return {object} the parsed options
 */
exports.processCommandLineArgs = function () {
    var options;
    var errors = [];


    options = commandLineArgs(argsConfig).parse();

    if (options.help) {
        printUsage();
        exit(0);
    }


    // convert all options to camel case
    options = _.mapKeys(options, function (dummy, key) {
        return camelCase(key);
    });


    // check options
    // -------------

    if (_.has(options, 'tag') && ['annotated', 'lightweight'].indexOf(options.tag) === -1) {
        errors.push('parameter tag must have values "annotated" or "lightweight", but is: ' + options.tag);
    }

    if (options.buildFolder) {
        if (options.buildFolder.match(/\.\.\//)) {
            errors.push('build folder contains \'../\' which is illegal');
        }
    } else {
        errors.push('no build folder given. This parameter is mandatory.');
    }

    if (errors.length) {
        printErrors(errors);
        exit(1);
    }

    return options;
};