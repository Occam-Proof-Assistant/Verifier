"use strict";

import ProofStep from "../step/proof";
import Supposition from "../supposition";
import verifyUnqualifiedStatement from "../verify/statement/unqualified";

import { nodeQuery } from "../utilities/query";

const statementNodeQuery = nodeQuery("/unqualifiedStatement/statement!"),
      unqualifiedStatementNodeQuery = nodeQuery("/supposition/unqualifiedStatement!");

export default function verifySupposition(suppositionNode, suppositions, localContext) {
  let suppositionVerified;

  const suppositionString = localContext.nodeAsString(suppositionNode);

  localContext.trace(`Verifying the '${suppositionString}' supposition...`, suppositionNode);

  const derived = false,
        assignments = [],
        unqualifiedStatementNode = unqualifiedStatementNodeQuery(suppositionNode),
        unqualifiedStatementVerified = verifyUnqualifiedStatement(unqualifiedStatementNode, assignments, derived, localContext);

  if (unqualifiedStatementVerified) {
    const statementNode = statementNodeQuery(unqualifiedStatementNode),
          proofStep = ProofStep.fromStatementNode(statementNode),
          supposition = Supposition.fromStatementNode(statementNode);

    suppositions.push(supposition);

    localContext.addProofStep(proofStep);

    assignments.every((assignment) => {
      const assigned = assignment.assign(localContext);

      if (assigned) {
        return true;
      }
    });

    suppositionVerified = true;
  }

  if (suppositionVerified) {
    localContext.debug(`...verified the '${suppositionString}' supposition.`, suppositionNode);
  }

  return suppositionVerified;
}
