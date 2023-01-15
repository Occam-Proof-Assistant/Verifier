"use strict";

import { nodeAsString } from "./utilities/string";
import { suppositionMatcher } from "./matcher/supposition";
import { nodeQuery, nodesQuery } from "./utilities/query";
import { statementNodeFromStatementString } from "./utilities/string";

const statementNodesQuery = nodesQuery("/subproofAssertion/statement"),
      subproofAssertionNodeQuery = nodeQuery("/statement/subproofAssertion!"),
      unqualifiedStatementStatementNodesQuery = nodesQuery("/subproof/unqualifiedStatement/statement!"),
      qualifiedOrUnqualifiedStatementStatementNodeQuery = nodeQuery("/subproof/subDerivation/qualifiedStatement|unqualifiedStatement[-1]/statement!");

export default class Supposition {
  constructor(statementNode) {
    this.statementNode = statementNode;
  }

  getStatementNode() {
    return this.statementNode;
  }

  matchSubproofNode(subproofNode, substitutions) {
    let subproofNodeMatches = false;

    const subproofAssertionNode = subproofAssertionNodeQuery(this.statementNode);

    if (subproofAssertionNode !== null) {
      const subproofAssertionStatementNodes = statementNodesQuery(subproofAssertionNode),
            unqualifiedStatementStatementNodes = unqualifiedStatementStatementNodesQuery(subproofNode),
            qualifiedOrUnqualifiedStatementStatementNode = qualifiedOrUnqualifiedStatementStatementNodeQuery(subproofNode),
            statementNodes = [
              ...unqualifiedStatementStatementNodes,
              qualifiedOrUnqualifiedStatementStatementNode
            ],
            statementNodesLength = statementNodes.length,
            subproofAssertionStatementNodesLength = subproofAssertionStatementNodes.length;

      if (statementNodesLength === subproofAssertionStatementNodesLength) {
        subproofNodeMatches = subproofAssertionStatementNodes.every((subproofAssertionStatementNode, index) => {
                                const statementNode = statementNodes[index],
                                      nonTerminalNode = statementNode, ///
                                      suppositionNonTerminalNode = subproofAssertionStatementNode,  ///
                                      nonTerminalNodeMatches = suppositionMatcher.matchNonTerminalNode(suppositionNonTerminalNode, nonTerminalNode, substitutions);

                                if (nonTerminalNodeMatches) {
                                  return true;
                                }
                              });
      }
    }

    return subproofNodeMatches;
  }

  matchStatementNode(statementNode, substitutions) {
    const nonTerminalNode = statementNode,  ///
          suppositionNonTerminalNode = this.statementNode,  ///
          nonTerminalNodeMatches = suppositionMatcher.matchNonTerminalNode(suppositionNonTerminalNode, nonTerminalNode, substitutions),
          statementNodeMatches = nonTerminalNodeMatches; ///

    return statementNodeMatches;
  }

  toJSON() {
    const statementString = nodeAsString(this.statementNode),
          statement = statementString, ///
          json = {
            statement
          };

    return json;
  }

  static fromJSON(json, releaseContext) {
    const { statement } = json,
          statementString = statement,  ///
          statementNode = statementNodeFromStatementString(statementString, releaseContext),
          supposition = new Supposition(statementNode);

    return supposition;
  }

  static fromStatementNode(statementNode) {
    const supposition = new Supposition(statementNode);

    return supposition;
  }
}
