"use strict";

const { Dependency } = require("occam-file-system"),
      { Log, verifyRelease, releaseContextUtilities } = require("../../lib/index");  ///

const { trimTrailingSlash } = require("../utilities/string"),
      { releaseContextFromDependencyAndDependentNames } = require("../utilities/releaseContext");

const { createReleaseContext, initialiseReleaseContext } = releaseContextUtilities;

function verifyAction(argument, logLevel) {
  const log = Log.fromLogLevel(logLevel),
        name = trimTrailingSlash(argument), ///
        context = {},
        dependency = Dependency.fromName(name),
        dependentNames = [],
        releaseContextMap = {};

  Object.assign(context, {
    log,
    releaseContextMap,
    releaseContextFromDependencyAndDependentNames
  });

  createReleaseContext(dependency, dependentNames, context, (error) => {
    if (error) {
      log.error(error);

      log.toConsole();

      return;
    }

    const releaseName = name, ///
          dependentName = releaseName,  ///
          releaseContext = releaseContextMap[releaseName],
          verified = releaseContext.isVerified();

    initialiseReleaseContext(dependency, dependentName, verified, context, (error) => {
      if (error) {
        log.error(error);

        log.toConsole();

        return;
      }

      delete context.releaseContextMap;
      delete context.releaseContextFromDependencyAndDependentNames;

      verifyRelease(releaseName, releaseContextMap);

      log.toConsole();
    });
  });
}

module.exports = verifyAction;
