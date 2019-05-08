#! /usr/bin/env node
var path = require("path");
var ansi = require("ansi-escape-sequences");
var cmdLineArgs = require("../lib/options");
var log = require("../lib/log");
var folders = require("../lib/folders");
var npm = require("../lib/npm");
var version = require("../lib/version");

var options;

options = cmdLineArgs.processCommandLineArgs();

//Xeyes.inspect(options);

folders.clearBuildBaseFolder(options.buildBaseFolder);

folders.copySourceFiles(options.sourceFolder, options.buildFolder);

npm.installDependencies(options.buildFolder);

if (options.versionFile) {
  version.createVersionsFile(
    path.join(options.buildFolder, options.versionFile),
    options.version,
    options.message
  );
} else {
  log.log("no version file generated (no filename given).");
}

folders.package(options.buildFolder, options.deploymentFile).then(() => {
  log.log(
    ansi.format(
      "deployment package [green]{" +
        options.deploymentFile +
        "} ready to be deployed"
    )
  );
  log.success("build finished.");
});
