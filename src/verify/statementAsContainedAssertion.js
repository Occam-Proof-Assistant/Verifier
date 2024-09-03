"use strict";

import metaLevelNodeVerifier from "../verifier/node/metaLevel";

import { isAssertionNegated } from "../utilities/verify";
import { nodeQuery, nodesQuery } from "../utilities/query";

const variableNodeQuery = nodeQuery("/statement/term/variable!"),
      metastatementVariableNodesQuery = nodesQuery("/statement/statement//variable");

export default function verifyStatementAsContainedAssertion(statementNode, assignments, derived, localContext) {
  let statementVerifiedAsContainedAssertion;

  const statementString = localContext.nodeAsString(statementNode);

  localContext.trace(`Verifying the '${statementString}' statement as a contained assertion...`, statementNode);

  const statementFunctions = [
    verifyStatementAsDerivedContainedAssertion,
    verifyStatementAsStatedContainedAssertion
  ];

  statementVerifiedAsContainedAssertion = statementFunctions.some((statementFunction) => {
    const statementVerifiedAsContainedAssertion = statementFunction(statementNode, assignments, derived, localContext);

    if (statementVerifiedAsContainedAssertion) {
      return true;
    }
  });

  if (statementVerifiedAsContainedAssertion) {
    localContext.debug(`...verified the '${statementString}' statement as a contained assertion.`, statementNode);
  }

  return statementVerifiedAsContainedAssertion;
}

function verifyStatementAsDerivedContainedAssertion(statementNode, assignments, derived, localContext) {
  let statementVerifiedAsDefinedContainedAssertion = false;

  if (derived) {
    const statementString = localContext.nodeAsString(statementNode);

    localContext.trace(`Verifying the derived '${statementString}' statement as a contained assertion...`, statementNode);

    const statementNegated = isAssertionNegated(statementNode),
          variableNode = variableNodeQuery(statementNode),
          negated = statementNegated;  ///

    if (false) {
      ///
    } else if (variableNode !== null) {
      const metastatementVariableNodes = metastatementVariableNodesQuery(statementNode),
            variableNodeMatchesMetaArgumentVariableNode = metastatementVariableNodes.some((metastatementVariableNode) => {
              const variableNodeMatchesMetaArgumentVariableNode = variableNode.match(metastatementVariableNode);

              if (variableNodeMatchesMetaArgumentVariableNode) {
                return true;
              }
            });

      if (!negated) {
        if (variableNodeMatchesMetaArgumentVariableNode) {
          statementVerifiedAsDefinedContainedAssertion = true;
        }
      }

      if (negated) {
        if (!variableNodeMatchesMetaArgumentVariableNode) {
          statementVerifiedAsDefinedContainedAssertion = true;
        }
      }
    }

    if (statementVerifiedAsDefinedContainedAssertion) {
      localContext.debug(`...verified the derived '${statementString}' statement as a contained assertion.`, statementNode);
    }
  }

  return statementVerifiedAsDefinedContainedAssertion;
}

function verifyStatementAsStatedContainedAssertion(statementNode, assignments, derived, localContext) {
  let statementVerifiedAsStatedContainedAssertion = false;

  if (!derived) {
    const statementString = localContext.nodeAsString(statementNode);

    localContext.trace(`Verifying the stated '${statementString}' statement as a contained assertion...`, statementNode);

    const intrinsicLevel = localContext.isIntrinsicLevel();

    if (intrinsicLevel) {
      localContext.debug(`The stated '${statementString}' statement as a contained assertion cannot be verified at intrinsic level.`, statementNode);
    } else {
      const nonTerminalNode = statementNode, ///
            nonTerminalNodeVerified = metaLevelNodeVerifier.verifyNonTerminalNode(nonTerminalNode, localContext, () => {
              const verifiedAhead = true;

              return verifiedAhead;
            });

      statementVerifiedAsStatedContainedAssertion = nonTerminalNodeVerified; ///
    }

    if (statementVerifiedAsStatedContainedAssertion) {
      localContext.debug(`...verified the stated '${statementString}' statement as a contained assertion.`, statementNode);
    }
  }

  return statementVerifiedAsStatedContainedAssertion;
}
