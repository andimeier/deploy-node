js-deploy
===========

Deploys Javascript applications.

At the moment, it simply builds a node application, the result being:

* a build folder cointaining the executable application
* a tar.gz file containing the targz'ed build folder (this is the "deployment package")

## Folder structure

The specified build folder will be populated with the following items:

1. an application folder
2. the targz'ed application folder

The filename of both is:

    PROJECT_VERSION+TIMESTAMP

So, the folder is e.g.:

    spectre_v1.2.3/

while the deployment package is

    spectre_v1.2.3.tar.gz

