"use strict";

import LocalContext from "../context/local";
import verifyDerivation from "../verify/derivation";

import { nodeQuery } from "../utilities/query";

const derivationNodeQuery = nodeQuery("/proof/derivation!");

export default function verifyProof(proofNode, statementNode, substitutions, localContext) {
  let proofVerified = false;

  localContext = LocalContext.fromLocalContext(localContext); ///

  const derivationNode = derivationNodeQuery(proofNode),
        derivationVerified = verifyDerivation(derivationNode, substitutions, localContext);

  if (derivationVerified) {
    const lastProofStep = localContext.getLastProofStep();

    if (lastProofStep !== null) {
      const lastProofStepStatementNode = lastProofStep.getStatementNode(),
            lastStatementNode = lastProofStepStatementNode, ///
            statementNodeMatchesLastStatementNode = statementNode.match(lastStatementNode);

      proofVerified = statementNodeMatchesLastStatementNode;  ///
    }
  }

  return proofVerified;
}
