#! /usr/bin/env node
var path = require('path');
var eyes = require('eyes');
var cmdLineArgs = require('../lib/options');
var log = require('../lib/log');
var folders = require('../lib/folders');
var npm = require('../lib/npm');
var version = require('../lib/version');

var options;


options = cmdLineArgs.processCommandLineArgs();

//eyes.inspect(options);


folders.clearBuildBaseFolder(options.buildBaseFolder);

folders.copySourceFiles(options.sourceFolder, options.buildFolder);

npm.installDependencies(options.buildFolder);

if (options.versionFile) {
    version.createVersionsFile(path.normalize(options.buildFolder + '/' + options.versionFile), options.message);
} else {
    log.log('no version file generated (no filename given).');
}

folders.package(options.buildFolder, options.deploymentFile, function () {
    log.success('deployment package ' + options.deploymentFile + ' ready to be deployed');
    log.success('Build finished.');
});
