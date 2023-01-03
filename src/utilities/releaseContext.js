"use strict";

import { last } from "../utilities/array";

export function createReleaseContext(dependency, dependentNames, context, callback) {
  const { releaseContextMap } = context,
        dependencyName = dependency.getName(),
        releaseName = dependencyName, ///
        releaseContext = releaseContextMap[releaseName] || null;

  if (releaseContext !== null) {
    const error = null;

    callback(error);

    return;
  }

  const { releaseContextFromDependencyAndDependentNames } = context;

  releaseContextFromDependencyAndDependentNames(dependency, dependentNames, context, (error, releaseContext) => {
    if (error) {
      callback(error);

      return;
    }

    if (releaseContext === null) {
      const error = `The '${releaseName}' package could not be created.`;

      callback(error);

      return;
    }

    const releaseMatchesDependency = checkReleaseMatchesDependency(dependency, dependentNames, releaseContext, context);

    if (!releaseMatchesDependency)  {
      const version = releaseContext.getVersion(),
            versionString = version.toString(),
            lastDependentName = last(dependentNames),
            dependentName = lastDependentName,  ///
            dependencyName = dependency.getName(),
            shortenedVersion = dependency.getShortedVersion(),
            shortenedVersionString = shortenedVersion.toString(),
            error = `Version mismatch: '${dependentName}' requires '${dependencyName}' to be version ${shortenedVersionString}.0 or higher but version ${versionString} has been supplied.`;

      callback(error);

      return;
    }

    releaseContextMap[releaseName] = releaseContext;

    createDependencyReleaseContexts(dependency, dependentNames, context, callback);
  }, context);
}

export function initialiseReleaseContext(dependency, dependentName, verified, context) {
  const { releaseContextMap } = context,
        dependencyName = dependency.getName(),
        releaseName = dependencyName, ///
        releaseContext = releaseContextMap[releaseName] || null;

  if (releaseContext === null) {
    return;
  }

  const initialised = releaseContext.isInitialised();

  if (initialised) {
    return;
  }

  const releaseContextVerified = releaseContext.isVerified();

  if (verified) {
    if (!releaseContextVerified) {
      const { log } = context;

      log .error(`Unable to initialise the '${releaseName}' dependency's context because its '${dependentName}' dependent is a package.`);

      return;
    }
  }

  verified = releaseContextVerified;  ///

  dependentName = releaseName;  ///

  const dependencies = releaseContext.getDependencies();

  dependencies.forEachDependency((dependency) => {
    initialiseReleaseContext(dependency, dependentName, verified, context);
  });

  const dependencyReleaseContexts = retrieveDependencyReleaseContexts(dependency, context);

  releaseContext.initialise(dependencyReleaseContexts);
}

export default {
  createReleaseContext,
  initialiseReleaseContext
};

function checkCyclicDependencyExists(dependency, dependentNames) {
  const dependencyName = dependency.getName(),
        dependentNamesIncludesDependencyName = dependentNames.includes(dependencyName),
        cyclicDependencyExists = dependentNamesIncludesDependencyName;  ///

  return cyclicDependencyExists;
}

function checkReleaseMatchesDependency(dependency, dependentNames, releaseContext, context) {
  let releaseMatchesDependency = true;

  const entries = releaseContext.getEntries(),
        shortenedVersion = dependency.getShortedVersion();

  if (shortenedVersion !== null) {
    const entriesMatchShortenedVersion = entries.matchShortenedVersion(shortenedVersion);

    if (!entriesMatchShortenedVersion) {
      releaseMatchesDependency = false;
    }
  }

  return releaseMatchesDependency;
}

function createDependencyReleaseContexts(dependency, dependentNames, context, callback) {
  const { releaseContextMap } = context,
        dependencyName = dependency.getName(),
        releaseName = dependencyName, ///
        releaseContext = releaseContextMap[releaseName],
        dependencies = releaseContext.getDependencies();

  dependentNames = [ ...dependentNames, dependencyName ];  ///

  dependencies.asynchronousForEachDependency((dependency, next, done) => {
    const cyclicDependencyExists = checkCyclicDependencyExists(dependency, dependentNames);

    if (cyclicDependencyExists) {
      const firstDependentName = first(dependentNames),
            dependencyNames = [  ///
              ...dependentNames,
              firstDependentName
            ],
            dependencyNamesString = dependencyNames.join(`' -> '`),
            error =`There is a cyclic dependency: '${dependencyNamesString}'.`;

      callback(error);

      return;
    }

    createReleaseContext(dependency, dependentNames, context, (error) => {
      if (error) {
        callback(error);

        return;
      }

      next();
    });
  }, () => {
    const error = null;

    callback(error);
  });
}

function retrieveDependencyReleaseContexts(dependency, context, dependencyReleaseContexts = []) {
  const { releaseContextMap } = context,
        dependencyName = dependency.getName(),
        releaseName = dependencyName, ///
        releaseContext = releaseContextMap[releaseName],
        dependencies = releaseContext.getDependencies();

  dependencies.forEachDependency((dependency) => {
    const dependencyName = dependency.getName(),
          releaseName = dependencyName, ///
          releaseContext = releaseContextMap[releaseName] || null;

    if (releaseContext === null) {
      return;
    }

    const dependencyReleaseContextsIncludesReleaseContext = dependencyReleaseContexts.includes(releaseContext);

    if (dependencyReleaseContextsIncludesReleaseContext) {
      return;
    }

    retrieveDependencyReleaseContexts(dependency, context, dependencyReleaseContexts);

    dependencyReleaseContexts.push(releaseContext);
  });

  return dependencyReleaseContexts;
}
