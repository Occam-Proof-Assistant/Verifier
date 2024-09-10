"use strict";

import { nodeQuery } from "../utilities/query";
import { nameFromMetavariableNode } from "../utilities/name";
import { verifyTermAgainstTermType } from "../metavariable";

const termNodeQuery = nodeQuery("/metavariable/argument/term"),
      typeNodeQuery = nodeQuery("/metavariable/argument/type");

export default function verifyMetavariable(metavariableNode, localContext) {
  let metavariableVerified = false;

  const metavariableString = localContext.nodeAsString(metavariableNode);

  localContext.trace(`Verifying the '${metavariableString}' metavariable...`, metavariableNode);

  const name = nameFromMetavariableNode(metavariableNode),
        metavariable = localContext.findMetavariableByName(name);

  if (metavariable === null) {
    localContext.debug(`The metavariable '${metavariableString}' is not present.`, metavariableNode);
  } else {
    const typeNode = typeNodeQuery(metavariableNode);

    if (typeNode !== null) {
      const typeString = localContext.nodeAsString(typeNode);

      localContext.debug(`The '${typeString}' type was found when a term should be present.`, typeNode);
    } else {
      const termType = metavariable.getTermType(),
            termNode = termNodeQuery(metavariableNode),
            typeString = localContext.nodeAsString(typeNode),
            termString = localContext.nodeAsString(termNode);

      if (false) {
        ///
      } else if ((termType === null) && (termNode === null)) {
        metavariableVerified = true;
      } else if ((termType === null) && (termNode !== null)) {
        localContext.debug(`The '${termString}' term was found when none is expected.`, termNode);
      } else if ((termType !== null) && (termNode === null)) {
        localContext.debug(`No term was found when the metavariable's term type is '${typeString}'.`, termNode);
      } else {
        const termVerifiedAgainstTermType = verifyTermAgainstTermType(termNode, termType, localContext);

        metavariableVerified = termVerifiedAgainstTermType; ///
      }
    }
  }

  if (metavariableVerified) {
    localContext.debug(`...verified the '${metavariableString}' metavariable.`, metavariableNode);
  }

  return metavariableVerified;
}
