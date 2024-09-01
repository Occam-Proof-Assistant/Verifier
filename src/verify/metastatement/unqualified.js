"use strict";

import verifyMetastatement from "../../verify/metastatement";

import { nodeQuery } from "../../utilities/query";

const metastatementNodeQuery = nodeQuery("/unqualifiedMetastatement/metastatement!");

export default function verifyUnqualifiedMetastatement(unqualifiedMetastatementNode, assignments, derived, localMetaContext) {
  let unqualifiedMetastatementVerified = false;

  const metastatementNode = metastatementNodeQuery(unqualifiedMetastatementNode),
        unqualifiedMetastatementString = localMetaContext.nodeAsString(unqualifiedMetastatementNode);

  localMetaContext.trace(`Verifying the '${unqualifiedMetastatementString}' unqualified metastatement...`, unqualifiedMetastatementNode);

  if (derived) {
    const matchesMetastatementNode = localMetaContext.matchMetastatementNode(metastatementNode);

    unqualifiedMetastatementVerified = matchesMetastatementNode;  ///
  }

  if (!unqualifiedMetastatementVerified) {
    const metastatementVerified = verifyMetastatement(metastatementNode, assignments, derived, localMetaContext);

    unqualifiedMetastatementVerified = metastatementVerified; ///
  }

  if (unqualifiedMetastatementVerified) {
    localMetaContext.debug(`...verified the '${unqualifiedMetastatementString}' unqualified metastatement.`, unqualifiedMetastatementNode);
  }

  return unqualifiedMetastatementVerified;
}
