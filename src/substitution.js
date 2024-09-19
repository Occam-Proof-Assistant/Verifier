"use strict";

export default class Substitution {
  isSimple() {
    const simple = true;

    return simple;
  }

  isComplex() {
    const simple = this.isSimple(),
          complex = !simple;

    return complex;
  }

  isResolved() {
    const simple = this.isSimple(),
          resolved = simple; ///

    return resolved;
  }

  getMetavariableNode() {
    const metavariableNode = null;

    return metavariableNode;
  }

  matchTermNode(termNode) {
    const termNodeMatches = false;

    return termNodeMatches;
  }

  matchVariableNode(variableNode) {
    const variableNodeMatches = false;

    return variableNodeMatches;
  }

  matchStatementNode(statementNode) {
    const statementNodeMatches = false;

    return statementNodeMatches;
  }

  matchMetavariableNode(metavariableNode) {
    const metavariableNodeMatches = false;

    return metavariableNodeMatches;
  }

  matchMetavariableNodeAndSubstitutionNode(metavariableNode, substitutionNode) {
    const metavariableNodeAndSubstitutionNodeMatches = false;

    return metavariableNodeAndSubstitutionNodeMatches;
  }

  unifyWithEquivalence(equivalence, substitutions, localContextA, localContextB) {
    let unifiedWithEquivalence = false;

    return unifiedWithEquivalence;
  }

  unifyWithEquivalences(equivalences, substitutions, localContextA, localContextB) {
    const unifiedWithEquivalences = equivalences.some((equivalence) => {
      const substitutionUnifiedWithEquivalence = this.unifyWithEquivalence(equivalence, substitutions, localContextA, localContextB);

      if (substitutionUnifiedWithEquivalence) {
        return true;
      }
    });

    return unifiedWithEquivalences;
  }
}
