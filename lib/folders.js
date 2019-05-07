const rimraf = require("rimraf");
const fs = require("fs-extra");
const tar = require("tar");
const die = require("./die");
const log = require("./log");
const fsUtils = require("./fsUtils");
const path = require("path");

/**
 * clears the build base folder
 *
 * @param {string} folder folder to be rimrafed
 */
exports.clearBuildBaseFolder = function(folder) {
  if (!folder) {
    die("no build folder configured.");
  }

  rimraf.sync(path.join(folder, "*"));

  log.log("cleaned build base folder [" + folder + "].");
};

/**
 * copies all source files to the build folder
 *
 * @param {string} srcFolder the folder containing the source files
 * @param {string} buildFolder the target folder to which the files should be copied
 */
exports.copySourceFiles = function(srcFolder, buildFolder) {
  if (!srcFolder) {
    throw new Error("no source folder given. Script error.");
  }

  if (!buildFolder) {
    throw new Error("no build folder given. Script error.");
  }

  if (!fsUtils.isDir(srcFolder)) {
    die(
      "source folder [" +
        srcFolder +
        "] is either not there or is no directory."
    );
  }

  fs.mkdirsSync(buildFolder);
  fs.copySync(srcFolder, buildFolder);

  log.log(
    "copied all source files from [" +
      srcFolder +
      "] to build folder [" +
      buildFolder +
      "]."
  );
};

/**
 * packages the build folder into a tar file. This is the deployment package to be deployed.
 *
 * @param {string} buildFolder the folder to be packed into the targz file
 * @param {string} deploymentFile the filename of the resulting targz file (deployment package file)
 * @return {Promise} Promise resolve on success and rejecting on error
 */
exports.package = function(buildFolder, deploymentFile, callback) {
  var tarFile;

  tarFile = deploymentFile;

  log.log(
    "tarring deployment folder [" + buildFolder + "] to " + tarFile + " ..."
  );

  return tar
    .c(
      {
        gzip: true,
        file: tarFile
      },
      [buildFolder]
    )
    .then(() => {
      log.log("deployment package created: " + tarFile);
    })
    .catch(err => {
      log.error("error at targz'ing the build folder", err.stack);
      die("error at targz'ing");
    });
};
