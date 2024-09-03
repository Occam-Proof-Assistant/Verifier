"use strict";

import Metatheorem from "../metatheorem";
import verifyLabels from "../verify/labels";
import LocalContext from "../context/local";
import verifyMetaproof from "../verify/metaproof";
import verifyMetaConsequent from "../verify/metaConsequent";
import verifyMetaSuppositions from "../verify/metaSuppositions";

import { first } from "../utilities/array";
import { nodeQuery, nodesQuery } from "../utilities/query";

const labelNodesQuery = nodesQuery("/metatheorem/label"),
      metaproofNodeQuery = nodeQuery("/metatheorem/metaproof!"),
      metaConsequentNodeQuery = nodeQuery("/metatheorem/metaConsequent!"),
      metaSuppositionsNodeQuery = nodesQuery("/metatheorem/metaSupposition");

export default function verifyMetatheorem(metatheoremNode, fileContext) {
  let metatheoremVerified = false;

  const labelNodes = labelNodesQuery(metatheoremNode),
        labelsString = fileContext.nodesAsString(labelNodes);

  fileContext.trace(`Verifying the '${labelsString}' metatheorem...`, metatheoremNode);

  const labels = [],
        labelsVerified = verifyLabels(labelNodes, labels, fileContext);

  if (labelsVerified) {
    const localContext = LocalContext.fromFileContext(fileContext), ///
          substitutions = [],
          metaSuppositions = [],
          metaSuppositionNodes = metaSuppositionsNodeQuery(metatheoremNode),
          metaSuppositionsVerified = verifyMetaSuppositions(metaSuppositionNodes, metaSuppositions, substitutions, localContext);

    if (metaSuppositionsVerified) {
      const metaConsequents = [],
            metaConsequentNode = metaConsequentNodeQuery(metatheoremNode),
            metaConsequentVerified = verifyMetaConsequent(metaConsequentNode, metaConsequents, substitutions, localContext);

      if (metaConsequentVerified) {
        const metaproofNode = metaproofNodeQuery(metatheoremNode),
              firstMetaConsequent = first(metaConsequents),
              metaConsequent = firstMetaConsequent, ///
              metastatementNode = metaConsequent.getMetastatementNode(),
              metaproofVerified = verifyMetaproof(metaproofNode, metastatementNode, substitutions, localContext);

        if (metaproofVerified) {
          const metatheorem = Metatheorem.fromLabelsMetaSuppositionsMetaConsequentSubstitutionsAndFileContext(labels, metaSuppositions, metaConsequent, substitutions, fileContext);

          fileContext.addMetatheorem(metatheorem);

          metatheoremVerified = true;
        }
      }
    }
  }

  if (metatheoremVerified) {
    fileContext.debug(`...verified the '${labelsString}' metatheorem.`, metatheoremNode);
  }

  return metatheoremVerified;
}
