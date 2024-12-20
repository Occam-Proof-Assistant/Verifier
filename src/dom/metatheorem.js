"use strict";

import LocalContext from "../context/local";
import TopLevelAssertion from "./topLevelAssertion";

import { domAssigned } from "../dom";
import { stringFromLabels } from "./topLevelAssertion";
import { labelsFromJSON,
         labelsToLabelsJSON,
         consequentFromJSON,
         suppositionsFromJSON,
         substitutionsFromJSON,
         consequentToConsequentJSON,
         suppositionsToSuppositionsJSON,
         substitutionsToSubstitutionsJSON } from "../utilities/json";

export default domAssigned(class Metatheorem extends TopLevelAssertion {
  verify() {
    let verified;

    const metatheorem = this, ///
          fileContext = this.getFileContext(),
          metatheoremString = metatheorem.getString();

    fileContext.trace(`Verifying the '${metatheoremString}' metatheorem...`);

    verified = super.verify();

    if (verified) {
      const metaTheorem = this; ///

      fileContext.addMetatheorem(metaTheorem);

      fileContext.debug(`...verified the '${metatheoremString}' metatheorem.`);
    }

    return verified;
  }

  verifyLabels() {
    const labelsVerified = this.labels.every((label) => {
      const nameOnly = false,
            labelVerified = label.verify(nameOnly);

      if (labelVerified) {
        return true;
      }
    });

    return labelsVerified;
  }

  unifyStatement(statement, substitutions, context) {
    let statementUnified;

    const metatheorem = this, ///
          statementString = statement.getString(),
          metatheoremString = metatheorem.getString();

    context.trace(`Unifying the '${statementString}' statement with the '${metatheoremString}' metatheorem...`);

    const suppositions = this.getSuppositions(),
          suppositionsLength = suppositions.length;

    if (suppositionsLength === 0) {
      const fileContext = this.getFileContext(),
            localContext = LocalContext.fromFileContext(fileContext),
            generalContext = localContext,  ///
            specificContext = context,  ///
            statementUnifiedWithConsequent = this.unifyStatementWithConsequent(statement, substitutions, generalContext, specificContext);

      statementUnified = statementUnifiedWithConsequent;  ///
    }

    if (statementUnified) {
      context.debug(`...unified the '${statementString}' statement with the '${metatheoremString}' metatheorem.`);
    }

    return statementUnified;
  }

  toJSON() {
    const labelsJSON = labelsToLabelsJSON(this.labels),
          consequentJSON = consequentToConsequentJSON(this.consequent),
          suppositionsJSON = suppositionsToSuppositionsJSON(this.suppositions),
          substitutionsJSON = substitutionsToSubstitutionsJSON(this.substitutions),
          labels = labelsJSON,  ///
          consequent = consequentJSON,  ///
          suppositions = suppositionsJSON,  ///
          substitutions = substitutionsJSON,  ///
          json = {
            labels,
            consequent,
            suppositions,
            substitutions
          };

    return json;
  }

  static name = "Metatheorem";

  static fromJSON(json, fileContext) {
    const labels = labelsFromJSON(json, fileContext),
          consequent = consequentFromJSON(json, fileContext),
          suppositions = suppositionsFromJSON(json, fileContext),
          substitutions = substitutionsFromJSON(json, fileContext),
          string = stringFromLabels(labels),
          proof = null,
          topLevelAssertion = new Metatheorem(fileContext, string, labels, substitutions, suppositions, consequent, proof);

    return topLevelAssertion;
  }

  static fromMetatheoremNode(metatheoremNode, fileContext) { return TopLevelAssertion.fromNode(Metatheorem, metatheoremNode, fileContext); }
});
