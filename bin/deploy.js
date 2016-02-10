#! /usr/bin/env node
var eyes = require('eyes');
var cmdLineArgs = require('../lib/options');

var options = {};



options = cmdLineArgs.parseCommandLineArgs();

eyes.inspect(options);

console.log("Alex was here, verbose: " + (options.verbose ? 'JA' : 'NEIN') + ', src=' + options.src);

