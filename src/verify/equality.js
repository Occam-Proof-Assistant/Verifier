"use strict";

import Equality from "../equality";
import verifyTerms from "../verify/terms";
import EqualityAssignment from "../assignment/equality";

import { nodeQuery } from "../utilities/query";
import { first, second } from "../utilities/array";

const leftTermNodeQuery = nodeQuery("/equality/argument[0]/term!"),
      rightTermNodeQuery = nodeQuery("/equality/argument[1]/term!");

export default function verifyEquality(equalityNode, assignments, derived, localContext, verifyAhead) {
  let equalityVerified;

  const equalityString = localContext.nodeAsString(equalityNode);

  localContext.trace(`Verifying the '${equalityString}' equality...`, equalityNode);

  const verifyEqualityFunctions = [
    verifyDerivedEquality,
    verifyGivenEquality
  ];

  equalityVerified = verifyEqualityFunctions.some((verifyEqualityFunction) => {
    const equalityVerified = verifyEqualityFunction(equalityNode, assignments, derived, localContext, verifyAhead);

    if (equalityVerified) {
      return true;
    }
  });

  if (equalityVerified) {
    localContext.debug(`...verified the '${equalityString}' equality.`, equalityNode);
  }

  return equalityVerified;
}

function verifyDerivedEquality(equalityNode, assignments, derived, localContext, verifyAhead) {
  let derivedEqualityVerified = false;

  if (derived) {
    const equalityString = localContext.nodeAsString(equalityNode);

    localContext.trace(`Verifying the '${equalityString}' derived equality...`, equalityNode);

    const terms = [],
          leftTermNode = leftTermNodeQuery(equalityNode),
          rightTermNode = rightTermNodeQuery(equalityNode),
          termNodes = [
            leftTermNode,
            rightTermNode
          ],
          termsVerified = verifyTerms(termNodes, terms, localContext, () => {
            let verifiedAhead = false;

            const firstTerm = first(terms),
                  secondTerm = second(terms),
                  leftTerm = firstTerm, ///
                  rightTerm = secondTerm, ///
                  equality = Equality.fromLeftTermRightTermAndEqualityNode(leftTerm, rightTerm, equalityNode);

            if (equality !== null) {
              const equalityEqual = equality.isEqual(localContext);

              if (equalityEqual) {
                const equalityAssignment = EqualityAssignment.fromEquality(equality),
                      assignment = equalityAssignment; ///

                assignments.push(assignment);

                verifiedAhead = verifyAhead();

                if (!verifiedAhead) {
                  assignments.pop();
                }
              }
            }

            return verifiedAhead;
          });

    derivedEqualityVerified = termsVerified; ///

    if (derivedEqualityVerified) {
      localContext.trace(`...verified the '${equalityString}' derived equality.`, equalityNode);
    }
  }

  return derivedEqualityVerified;
}

function verifyGivenEquality(equalityNode, assignments, derived, localContext, verifyAhead) {
  let givenEqualityVerified = false;

  if (!derived) {
    const equalityString = localContext.nodeAsString(equalityNode);

    localContext.trace(`Verifying the '${equalityString}' given equality...`, equalityNode);

    const terms = [],
          leftTermNode = leftTermNodeQuery(equalityNode),
          rightTermNode = rightTermNodeQuery(equalityNode),
          termNodes = [
            leftTermNode,
            rightTermNode
          ],
          termsVerified = verifyTerms(termNodes, terms, localContext, () => {
            let verifiedAhead = false;

            const firstTerm = first(terms),
                  secondTerm = second(terms),
                  leftTerm = firstTerm, ///
                  rightTerm = secondTerm, ///
                  equality = Equality.fromLeftTermRightTermAndEqualityNode(leftTerm, rightTerm, equalityNode);

            if (equality !== null) {
              const equalityAssignment = EqualityAssignment.fromEquality(equality),
                    assignment = equalityAssignment; ///

              assignments.push(assignment);

              verifiedAhead = verifyAhead();

              if (!verifiedAhead) {
                assignments.pop();
              }
            }

            return verifiedAhead;
          });

    givenEqualityVerified = termsVerified; ///

    if (givenEqualityVerified) {
      localContext.trace(`...verified the '${equalityString}' given equality.`, equalityNode);
    }
  }

  return givenEqualityVerified;
}
