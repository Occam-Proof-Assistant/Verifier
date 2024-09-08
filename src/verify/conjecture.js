"use strict";

import Conjecture from "../conjecture";
import verifyProof from "../verify/proof";
import verifyLabels from "../verify/labels";
import LocalContext from "../context/local";
import Substitutions from "../substitutions";
import verifyConsequent from "../verify/consequent";
import verifySuppositions from "../verify/suppositions";

import { first } from "../utilities/array";
import { nodeQuery, nodesQuery } from "../utilities/query";

const proofNodeQuery = nodeQuery("/conjecture/proof!"),
      labelNodesQuery = nodesQuery("/conjecture/label!"),
      consequentNodeQuery = nodeQuery("/conjecture/consequent!"),
      suppositionsNodeQuery = nodesQuery("/conjecture/supposition");

export default function verifyConjecture(conjectureNode, fileContext) {
  let conjectureVerified = false;

  const labelNodes = labelNodesQuery(conjectureNode),
        labelsString = fileContext.nodesAsString(labelNodes);

  fileContext.trace(`Verifying the '${labelsString}' conjecture...`, conjectureNode);

  const labels = [],
        labelsVerified = verifyLabels(labelNodes, labels, fileContext);

  if (labelsVerified) {
    const localContext = LocalContext.fromFileContext(fileContext),
          suppositions = [],
          suppositionNodes = suppositionsNodeQuery(conjectureNode),
          suppositionsVerified = verifySuppositions(suppositionNodes, suppositions, localContext);

    if (suppositionsVerified) {
      const consequents = [],
            consequentNode = consequentNodeQuery(conjectureNode),
            consequentVerified = verifyConsequent(consequentNode, consequents, localContext);

      if (consequentVerified) {
        const proofNode = proofNodeQuery(conjectureNode),
              firstConsequent = first(consequents),
              consequent = firstConsequent; ///

        if (proofNode !== null) {
          const substitutions = Substitutions.fromNothing();

          verifyProof(proofNode, consequent, substitutions, localContext);
        }

        const substitutions = Substitutions.fromNothing(),
              conjecture = Conjecture.fromLabelsSuppositionsConsequentSubstitutionsAndFileContext(labels, suppositions, consequent, substitutions, fileContext);

        fileContext.addConjecture(conjecture);

        conjectureVerified = true;
      }
    }
  }

  if (conjectureVerified) {
    fileContext.debug(`...verified the '${labelsString}' conjecture.`, conjectureNode);
  }

  return conjectureVerified;
}
