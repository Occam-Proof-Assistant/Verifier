"use strict";

export default class Equality {
  constructor(node, leftTerm, rightTerm) {
    this.node = node;
    this.leftTerm = leftTerm;
    this.rightTerm = rightTerm;
  }

  getNode() {
    return this.node;
  }

  getLeftTerm() {
    return this.leftTerm;
  }

  getRightTerm() {
    return this.rightTerm;
  }

  isReflexive() {
    const leftTermMatchesRightTerm = this.leftTerm.match(this.rightTerm),
          reflexive = leftTermMatchesRightTerm;

    return reflexive;
  }

  static fromLeftTermRightTermAndEqualityNode(leftTerm, rightTerm, equalityNode) {
    let equality = null;

    const leftTermType = leftTerm.getType(),
          rightTermType = rightTerm.getType(),
          leftTermTypeComparableToRightTermType = leftTermType.isComparableTo(rightTermType);

    if (leftTermTypeComparableToRightTermType) {
      const node = equalityNode;  ///

      equality = new Equality(node, leftTerm, rightTerm);
    }

    return equality;
  }
}
