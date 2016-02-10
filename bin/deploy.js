#! /usr/bin/env node
var eyes = require('eyes');
var cmdLineArgs = require('../lib/options');
var log = require('../lib/log');
var folders = require('../lib/folders');

var options = {};


options = cmdLineArgs.processCommandLineArgs();

eyes.inspect(options);

log.info("Alex was here, verbose: " + (options.verbose ? 'JA' : 'NEIN') + ', src=' + options.src);

folders.clearBuildFolder(options.buildFolder);
