#! /usr/bin/env node
var path = require('path');
var eyes = require('eyes');
var cmdLineArgs = require('../lib/options');
var log = require('../lib/log');
var folders = require('../lib/folders');
var npm = require('../lib/npm');
var version = require('../lib/version');

var options = {};


options = cmdLineArgs.processCommandLineArgs();

eyes.inspect(options);

folders.clearBuildFolder(options.buildFolder);

folders.copySourceFiles(options.sourceFolder, options.buildFolder);

npm.installDependencies(options.buildFolder);

if (options.versionFile) {
    version.createVersionsFile(path.normalize(options.buildFolder + '/' + options.versionFile), options.message);
} else {
    log.log('no version file generated (no filename given).');
}


log.success('Build finished.');