/**
 * Created by z003d5bd on 10.02.2016.
 */
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const camelCase = require("camelcase");
const chalk = require("chalk");
const _ = require("lodash");
const exit = require("exit");
const die = require("./die");
const log = require("./log");
const path = require("path");

// the command line options
var argsConfig = [
  { name: "verbose", alias: "v", type: Boolean, description: "Verbose output" },
  {
    name: "message",
    alias: "m",
    type: String,
    typeLabel: "{underline message}",
    description:
      "Deployment message which will be written into the version file. If omitted or if " +
      "no version file is generated, no message will be written."
  },
  {
    name: "version-file",
    type: String,
    typeLabel: "{underline filename}",
    description: "File name of version file to be written"
  },
  {
    name: "batch",
    alias: "b",
    type: Boolean,
    description:
      "Enable batch mode. " +
      "There are no interactions, no user confirmations etc. " +
      "Suitable for e.g. a build triggered by a CI server"
  },
  {
    name: "build-folder",
    alias: "o",
    typeLabel: "{underline folder}",
    type: String,
    defaultValue: "dist",
    description:
      "Folder in which the build takes place. " +
      "The contents of this folder will then be packaged to the output file. " +
      'Default is "dist".'
  },
  {
    name: "source-folder",
    alias: "s",
    typeLabel: "{underline folder}",
    type: String,
    defaultValue: "src",
    description:
      "Folder containing the source files to be packaged. " +
      "The contents of this folder will be transferred to the build folder, then packaged to the output file. " +
      'Default is "src".'
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Display this help message"
  }
];

/**
 * display all collected errors
 *
 * @errors {array} array of error strings
 */
function printErrors(errors) {
  errors.forEach(function(error) {
    console.log(chalk.red(error));
  });
  console.log("Call with -h / --help to see usage info.");
}

/**
 * prints the usage info
 */
function printUsage() {
  const usageHeader = {
    header: "Tool for building node apps",
    content:
      "Helps you with building a deployment continaining only the relevant files for production."
  };
  const usage = commandLineUsage([usageHeader, { optionList: argsConfig }]);
  console.log(usage);

  /*
  console.log(
    commandLineArgs(argsConfig).getUsage({
      title: "deploy.js",
      description: "Deployment script for node and Angular apps."
    })
  );
*/
}

/**
 * parses the command line parameters, validates options, adds default options etc. The result is a valid options
 * object which can be used in the script without further checking. All validations should have been done by this
 * function already.
 *
 * @return {object} the parsed options
 */
exports.processCommandLineArgs = function() {
  var options;
  var errors = [];

  options = commandLineArgs(argsConfig);

  if (options.help) {
    printUsage();
    exit(0);
  }

  // convert all options to camel case
  options = _.mapKeys(options, function(dummy, key) {
    return camelCase(key);
  });

  // check options
  // -------------

  if (options.buildFolder) {
    if (options.buildFolder.match(/\.\.\//)) {
      errors.push("build folder contains '../' which is illegal");
    }
  } else {
    errors.push(`no build folder given.`);
  }

  if (options.sourceFolder) {
    if (options.sourceFolder.match(/\.\.\//)) {
      errors.push("source folder contains '../' which is illegal");
    }
  } else {
    errors.push(`no source folder given.`);
  }

  if (!options.project) {
    options.project = process.env.npm_package_name;
    if (!options.project) {
      die(
        "no project name given (parameter --project) and no npm environment found to extract the project name from"
      );
    }

    log.log("project name extracted from npm environment: " + options.project);
  }

  if (errors.length) {
    printErrors(errors);
    exit(1);
  }

  return options;
};
