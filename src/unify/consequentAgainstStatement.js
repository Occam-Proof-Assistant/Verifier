"use strict";

import LocalContext from "../context/local";

export default function unifyConsequentAgainstStatement(consequentA, statementNodeB, substitutions, fileContextA, localContextB) {
  let consequentUnified = false;

  const consequentAStatementNode = consequentA.getStatementNode();

  if (consequentAStatementNode !== null) {
    const localContextA = LocalContext.fromFileContext(fileContextA),
          statementNodeA = consequentAStatementNode,  ///
          statementStringA = localContextA.nodeAsString(statementNodeA),
          statementStringB = localContextB.nodeAsString(statementNodeB);

    substitutions.snapshot();

    localContextB.trace(`Unifying the '${statementStringB}' statement against the consequent's '${statementStringA}' statement...`, statementNodeB);

    const statementUnified = consequentA.unifyStatement(statementNodeB, substitutions, localContextA, localContextB);

    consequentUnified = statementUnified; ///

    consequentUnified ?
      substitutions.continue() :
        substitutions.rollback();

    if (consequentUnified) {
      localContextB.debug(`...unified the '${statementStringB}' statement against the consequent's '${statementStringA}' statement.`, statementNodeB);
    }
  }

  return consequentUnified;
}
