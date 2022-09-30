"use strict";

const MetaproofContext = require("../context/metaproof"),
      verifyMetaAntecedent = require("../verify/metaAntecedent"),
      verifyQualifiedMetastatement = require("../verify/metastatement/qualified"),
      verifyUnqualifiedMetastatement = require("../verify/metastatement/unqualified");

const { nodeQuery, nodesQuery } = require("../utilities/query"),
      { META_SUBLEMMA_RULE_NAME, QUALIFIED_METASTATEMENT_RULE_NAME, UNQUALIFIED_METASTATEMENT_RULE_NAME } = require("../ruleNames");

const metaAntecedentNodeQuery = nodeQuery("/metaSublemma/metaAntecedent!"),
      metaDerivationNodeQuery = nodeQuery("/metaSublemma/metaDerivation!"),
      metaSublemmaChildNodesQuery = nodesQuery("/metaDerivation/*");

function verifyMetaDerivation(metaNode, context) {
  const metaSublemmaChildNodes = metaSublemmaChildNodesQuery(metaNode),
        metaSublemmaQualifiedMetastatementUnqualifiedStatementsVerified = metaSublemmaChildNodes.every((metaSublemmaChildNode) => {
          let metaSublemmaChildNodeVerified;

          const ruleName = metaSublemmaChildNode.getRuleName();

          switch (ruleName) {
            case META_SUBLEMMA_RULE_NAME: {
              const metaSublemmaNode = metaSublemmaChildNode,  ///
                    metaSublemmaVerified = verifyMetaSublemma(metaSublemmaNode, context);

              metaSublemmaChildNodeVerified = metaSublemmaVerified;  ///

              break;
            }

            case QUALIFIED_METASTATEMENT_RULE_NAME: {
              const qualifiedMetastatementNode = metaSublemmaChildNode,  ///
                    qualifiedMetastatementVerified = verifyQualifiedMetastatement(qualifiedMetastatementNode, context);

              metaSublemmaChildNodeVerified = qualifiedMetastatementVerified;  ///

              break;
            }

            case UNQUALIFIED_METASTATEMENT_RULE_NAME: {
              const unqualifiedMetastatementNode = metaSublemmaChildNode,  ///
                    unqualifiedMetastatementVerified = verifyUnqualifiedMetastatement(unqualifiedMetastatementNode, context);

              metaSublemmaChildNodeVerified = unqualifiedMetastatementVerified;  ///

              break;
            }
          }

          return metaSublemmaChildNodeVerified;
        }),
        metaDerivationVerified = metaSublemmaQualifiedMetastatementUnqualifiedStatementsVerified;  ///

  return metaDerivationVerified;
}

module.exports = verifyMetaDerivation;

function verifyMetaSublemma(metaSublemmaNode, context) {
  let metaSublemmaVerified = false;

  const metaproofContext = MetaproofContext.fromContext(context);

  context = metaproofContext; ///

  const metaAntecedents = [],
        metaAntecedentNode = metaAntecedentNodeQuery(metaSublemmaNode),
        metaAntecedentVerified = verifyMetaAntecedent(metaAntecedentNode, metaAntecedents, context);

  if (metaAntecedentVerified) {
    let metaDerivationVerified = true;

    const metaDerivationNode = metaDerivationNodeQuery(metaSublemmaNode);

    if (metaDerivationNode !== null) {
      metaDerivationVerified = verifyMetaDerivation(metaDerivationNode, context);
    }

    if (metaDerivationVerified) {

    }
  }

  return metaSublemmaVerified;
}
