"use strict";

import Substitution from "../substitution";
import TermForVariableSubstitution from "./termForVariable";
import unifyStatementAgainstStatement from "../unify/statementAtainstStatement";

import { bracketedStatementChildNodeFromStatementNode } from "../utilities/match";
import { statementNodeFromStatementString, metavariableNodeFromMetavariableString } from "../utilities/node";

export default class StatementForMetavariableSubstitution extends Substitution {
  constructor(metavariableNode, statementNode, substitution) {
    super();

    this.metavariableNode = metavariableNode;
    this.statementNode = statementNode;
    this.substitution = substitution;
  }

  getMetavariableNode() {
    return this.metavariableNode;
  }

  getStatementNode() {
    return this.statementNode;
  }

  getSubstitution() {
    return this.substitution;
  }

  matchStatementNode(statementNode, substitutions, localContextA, localContextB) {
    let statementNodeMatches;

    const substitution = this.substitution, ///
          statementNodeA = statementNode,  ///
          statementNodeB = this.statementNode; ///

    statementNodeMatches = matchStatementNode(statementNodeA, statementNodeB, substitution, substitutions, localContextA, localContextB);

    if (!statementNodeMatches) {
      const bracketedStatementChildNode = bracketedStatementChildNodeFromStatementNode(statementNode);

      if (bracketedStatementChildNode !== null) {
        const statementNodeA = bracketedStatementChildNode; ///

        statementNodeMatches = matchStatementNode(statementNodeA, statementNodeB, substitution, substitutions, localContextA, localContextB);
      }
    }

    return statementNodeMatches;
  }

  matchMetavariableNode(metavariableNode) {
    const matchesMetavariableNode = this.metavariableNode.match(metavariableNode);

    return matchesMetavariableNode;
  }

  static fromJSONAndFileContext(json, fileContext) {
    const { metavariable, statement } = json,
            metavariableString = metavariable,  ///
            statementString = statement,  ///
            lexer = fileContext.getLexer(),
            parser = fileContext.getParser(),
            statementNode = statementNodeFromStatementString(statementString, lexer, parser),
            metavariableNode = metavariableNodeFromMetavariableString(metavariableString, lexer, parser),
            statementForMetavariableSubstitution = new StatementForMetavariableSubstitution(statementNode, metavariableNode);

    return statementForMetavariableSubstitution;
  }

  static fromMetavariableNodeAndStatementNode(metavariableNode, statementNode) {
    let statementForMetavariableSubstitution;

    const substitution = null;

    statementForMetavariableSubstitution = new StatementForMetavariableSubstitution(metavariableNode, statementNode, substitution);

    const bracketedStatementChildNode = bracketedStatementChildNodeFromStatementNode(statementNode);

    if (bracketedStatementChildNode !== null) {
      const statementNode = bracketedStatementChildNode; ///

      statementForMetavariableSubstitution = new StatementForMetavariableSubstitution(metavariableNode, statementNode, substitution);
    }

    return statementForMetavariableSubstitution;
  }

  static fromMetavariableNodeStatementNodeAndSubstitutionNode(metavariableNode, statementNode, substitutionNode) {
    let statementForMetavariableSubstitution;

    let substitution = null;

    if (substitutionNode !== null) {
      const termForVariableSubstitution = TermForVariableSubstitution.fromSubstitutionNode(substitutionNode);

      substitution = termForVariableSubstitution; ///
    }

    statementForMetavariableSubstitution = new StatementForMetavariableSubstitution(metavariableNode, statementNode, substitution);

    const bracketedStatementChildNode = bracketedStatementChildNodeFromStatementNode(statementNode);

    if (bracketedStatementChildNode !== null) {
      const statementNode = bracketedStatementChildNode; ///

      statementForMetavariableSubstitution = new StatementForMetavariableSubstitution(metavariableNode, statementNode, substitution);
    }

    return statementForMetavariableSubstitution;
  }
}

function matchStatementNode(statementNodeA, statementNodeB, substitution, substitutions, localContextA, localContextB) {
  let statementNodeMatches;

  if (substitution === null) {
    const statementNodeAMatchesStatementNodeB = statementNodeB.match(statementNodeA);

    statementNodeMatches = statementNodeAMatchesStatementNodeB; ///
  } else {
    const statementVerifiedAgainstStatement = unifyStatementAgainstStatement(statementNodeA, statementNodeB, substitution, substitutions, localContextA, localContextB);

    statementNodeMatches = statementVerifiedAgainstStatement; ///
  }

  return statementNodeMatches;

}