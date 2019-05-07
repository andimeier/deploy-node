deploy-node
===========

Deploys Javascript applications. To be used as a npm script because some properties will be drawn 
from the environment variables which `npm` adds for the scripts.

At the moment, it simply builds a node application, the result being:

* a build folder cointaining the executable application
* a tar.gz file containing the targz'ed build folder (this is the "deployment package")

## Folder structure

The specified build folder (the "dist" folder) will be populated with the following items:

1. an application folder
2. the targz'ed application folder

The filename of both is:

    PROJECT_VERSION+TIMESTAMP

So, the folder is e.g.:

    spectre_v1.2.3/

while the deployment package is

    spectre_v1.2.3.tar.gz

## Steps

`deploy-node` will perform the following steps:

* copy all source files to the `dist` folder in a subfolder named after the project, e.g. `dist/PROJECT_v1.0.0`
* install `node_modules` with `--production` flag, so only the production dependencies are installed
* generate a version file
* targz the folder

## Installation

Include the deploy scripts using:

    npm install --save-dev deploy-node

This will install the `deploy-node` libs into your `node_modules` and a binary named `deploy` in `node_modules/.bin`, so that npm scripts can use the `deploy` command.

## Usage

Typical usage is to include `deploy-node` in your npm scripts in `package.json` like this:

```json
{
  ...
  "scripts": {
	"build": "deploy --version-file version.json"
  }
}
```

List all available options with `deploy --help`, the output will be something like this:

```
deploy.js

  Deployment script for node and Angular apps.

Options

  -v, --verbose                Verbose output
  -m, --message message        Deployment message
  --timestamp                  Add timestamp to filename of output file
  --detect-config-changes      Warn if the config files have changed since the last tagged version
  --print-last-commit          Print the log message of the last commit
  -p, --project name           Name of the project as it. This will be used as a prefix for the filename of
                               the deployment package. If omitted, the script tries to retrieve the project
                               name from the environment (this only works if the script was invoked via 'npm
                               run'). In this case, the project name specified in the package.json file will
                               be used.
  --workdir-clean              Warn if the work directory is dirty
  -t, --tag tag_type           Specify the type of Git tag to be set. [tag_type] can be either "lightweight"
                               or "annotated" (or any abbreviation of these terms). If this parameter is not
                               provided, no Git tag will be created.
  --version-file filename      File name of version file to be written
  -b, --batch                  Enable batch mode. There are no interactions, no user confirmations etc.
                               Suitable for e.g. a build triggered by a CI server
  -o, --build-folder folder    Folder in which the build takes place. The contents of this folder will then
                               be packaged to the output file. This parameter is mandatory.
  -s, --source-folder folder   Folder containing the source file to be packaged. The contents of this folder
                               will be transferred to the build folder, then packaged to the output file.
                               This parameter is mandatory.
  -h, --help                   Display this help message
  ```
