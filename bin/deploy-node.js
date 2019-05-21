#! /usr/bin/env node
const path = require("path");
const ansi = require("ansi-escape-sequences");
const cmdLineArgs = require("../lib/options");
const log = require("../lib/log");
const folders = require("../lib/folders");
const npm = require("../lib/npm");
const version = require("../lib/version");

var options;

options = cmdLineArgs.processCommandLineArgs();

folders.clearBuildFolder(options.buildFolder);

folders.copySourceFiles(options.sourceFolder, options.buildFolder);

npm.installDependencies(options.buildFolder);

if (options.versionFile) {
  // retrieve version from npm environment
  options.version = process.env.npm_package_version;
  if (!options.version) {
    die(`unable to retrieve version from npm environment.`);
  }

  version.createVersionsFile(
    path.join(options.buildFolder, options.versionFile),
    options.version,
    options.message
  );
} else {
  log.log("no version file generated (no filename given).");
}

log.success("build finished.");
log.success(
  `"The app has been built in the following directory: ${options.buildFolder}`
);
