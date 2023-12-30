"use strict";

import fileMixins from "../mixins/file";
import loggingMixins from "../mixins/logging";

import { last, filter } from "../utilities/array";

class LocalMetaContext {
  constructor(context, metavariables, metaproofSteps) {
    this.context = context;
    this.metavariables = metavariables;
    this.metaproofSteps = metaproofSteps;
  }

  getContext() {
    return this.context;
  }

  getMetavariables() {
    let metavariables = this.context.getMetavariables();

    metavariables = [ ///
      ...metavariables,
      this.metavariables
    ]

    return metavariables;
  }

  getMetaproofSteps() {
    let metaproofSteps = this.context.getMetaproofSteps();

    metaproofSteps = [  ///
      ...metaproofSteps,
      ...this.metaproofSteps
    ];

    return metaproofSteps;
  }

  getVariables() { return this.context.getVariables(); }

  getLastMetaproofStep() {
    let lastMetaproofStep = null;

    const metaproofStepsLength = this.metaproofSteps.length;

    if (metaproofStepsLength > 0) {
      lastMetaproofStep = last(this.metaproofSteps);
    }

    return lastMetaproofStep;
  }

  addMetavariable(metavariable) {
    const metavariableName = metavariable.getName();

    filter(this.metavariables, (metavariable) => {
      const name = metavariable.getName(),
            nameMetavariableName = (name === metavariableName);

      if (!nameMetavariableName) {
        return true;
      }
    });

    this.metavariables.push(metavariable);
  }

  addMetaproofStep(metaproofStep) {
    this.metaproofSteps.push(metaproofStep);
  }

  matchMetastatement(metastatementNode) {
    let metastatementMatches = false;

    if (!metastatementMatches) {
      const proofStepMatchesMetastatement = this.metaproofSteps.some((metaproofStep) => {
        const proofStepMatchesMetastatement = metaproofStep.match(metastatementNode);

        if (proofStepMatchesMetastatement) {
          return true;
        }
      });

      metastatementMatches = proofStepMatchesMetastatement; ///
    }

    if (!metastatementMatches) {
      metastatementMatches = this.context.matchMetastatement(metastatementNode);
    }

    return metastatementMatches;
  }

  findMetavariableByMetavariableName(metavariableName) {
    const name = metavariableName,  ///
          metavariables = this.getMetavariables(),
          metavariable = metavariables.find((metavariable) => {
            const matches = metavariable.matchName(name);

            if (matches) {
              return true;
            }
          }) || null;

    return metavariable;
  }

  isMetavariablePresentByMetavariableName(metavariableName) {
    const metavariable = this.findMetavariableByMetavariableName(metavariableName),
          metavariablePresent = (metavariable !== null);

    return metavariablePresent;
  }

  static fromFileContext(fileContext) {
    const context = fileContext,  ///
          metavariables = [],
          metaproofSteps = [],
          localMetaContext = new LocalMetaContext(context, metavariables, metaproofSteps);

    return localMetaContext;
  }

  static fromLocalMetaContext(localMetaContext) {
    const context = localMetaContext,  ///
          metavariables = [],
          metaproofSteps = [];

    localMetaContext = new LocalMetaContext(context, metavariables, metaproofSteps);  ///

    return localMetaContext;
  }
}

Object.assign(LocalMetaContext.prototype, fileMixins);
Object.assign(LocalMetaContext.prototype, loggingMixins);

export default LocalMetaContext;