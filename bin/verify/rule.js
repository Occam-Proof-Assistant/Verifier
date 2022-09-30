"use strict";

const { loggingUtilities } = require("necessary");

const verifyMetaproof = require("../verify/metaproof"),
      verifyInferenceConditionalRule = require("../verify/rule/inferenceConditional"),
      verifyUnqualifiedMetastatementRule = require("../verify/rule/unqualifiedMetastatement");

const { nodesAsString } = require("../utilities/string"),
      { nodeQuery, nodesQuery } = require("../utilities/query");

const { log } = loggingUtilities;

const labelNodesQuery = nodesQuery("/rule/label"),
      metaproofNodeQuery = nodeQuery("/rule/metaproof");

function verifyRule(ruleNode, context) {
  let ruleVerified = false;

  const labelNodes = labelNodesQuery(ruleNode),
        labelsString = nodesAsString(labelNodes);

  log.debug(`Verifying the '${labelsString}' rule...`);

  const inferenceConditionalRuleVerified = verifyInferenceConditionalRule(ruleNode, context),
        unqualifiedMetastatementRuleVerified = verifyUnqualifiedMetastatementRule(ruleNode, context);

  if (inferenceConditionalRuleVerified || unqualifiedMetastatementRuleVerified) {
    const metaproofNode = metaproofNodeQuery(ruleNode);

    if (metaproofNode !== null) {
      const metaproofVerified = verifyMetaproof(metaproofNode, context);

      ruleVerified = metaproofVerified; ///
    } else {
      ruleVerified = true;
    }
  }

  if (ruleVerified) {
    log.info(`Verified the '${labelsString}' rule.`);
  }

  return ruleVerified;
}

module.exports = verifyRule;
