"use strict";

import shim from "./shim";

import { assignAssignments } from "./utilities/assignments";
import { subproofAssertionFromStatement } from "./utilities/verification";
import { statementFromJSON, statementToStatementJSON } from "./utilities/json";

class Premise {
  constructor(string, statement) {
    this.string = string;
    this.statement = statement;
  }

  getString() {
    return this.string;
  }

  getStatement() {
    return this.statement;
  }

  unifyIndependently(substitutions, generalContext, specificContext) {
    let unifiedIndependently;

    const premise = this, ///
          premiseString = premise.getString();

    specificContext.trace(`Unifying the '${premiseString}' premise independently...`);

    const statementResolvedIndependently = this.statement.unifyIndependently(substitutions, generalContext, specificContext);

    unifiedIndependently = statementResolvedIndependently;  ///

    if (unifiedIndependently) {
      specificContext.trace(`...unified the '${premiseString}' premise independently.`);
    }

    return unifiedIndependently;
  }

  unifyProofStep(proofStep, substitutions, generalContext, specificContext) {
    let proofStepUnified = false;

    const subproof = proofStep.getSubproof(),
          statement = proofStep.getStatement();

    substitutions.snapshot();

    let subproofUnified = false,
        statementUnified = false;

    if (false) {
      ///
    } else if (subproof !== null) {
      subproofUnified = this.unifySubproof(subproof, substitutions, generalContext, specificContext);
    } else if (statement !== null) {
      statementUnified = this.unifyStatement(statement, substitutions, generalContext, specificContext);
    }

    if (subproofUnified || statementUnified) {
      substitutions.resolve(generalContext, specificContext);

      proofStepUnified = true;
    }

    const context = specificContext;  ///

    proofStepUnified ?
      substitutions.continue() :
        substitutions.rollback(context);

    return proofStepUnified;
  }

  unifyStatement(statement, substitutions, generalContext, specificContext) {
    let statementUnified;

    const premise = this, ///
          premiseString = premise.getString(),
          statementString = statement.getString();

    specificContext.trace(`Unifying the '${statementString}' statement with the '${premiseString}' premise...`);

    statementUnified = this.statement.unifyStatement(statement, substitutions, generalContext, specificContext);

    if (statementUnified) {
      specificContext.debug(`...unified the '${statementString}' statement with the '${premiseString}' premise.`);
    }

    return statementUnified;
  }

  unifySubproof(subproof, substitutions, generalContext, specificContext) {
    let subproofUnified = false;

    const premise = this, ///
          subproofString = subproof.getString(),
          premiseStatement = premise.getStatement(),
          premiseStatementString = premiseStatement.getString();

    specificContext.trace(`Unifying the '${subproofString}' subproof with the premise's '${premiseStatementString}' statement...`);

    const context = generalContext,
          statement = this.statement.getStatement(),
          subproofAssertion = subproofAssertionFromStatement(statement, context);

    if (subproofAssertion !== null) {
      subproofUnified = subproofAssertion.unifySubproof(subproof, substitutions, generalContext, specificContext);
    }

    if (subproofUnified) {
      specificContext.debug(`...unified the '${subproofString}' subproof with the premise's '${premiseStatementString}' statement.`);
    }

    return subproofUnified;
  }

  verify(context) {
    let verified = false;

    const premiseString = this.string; ///

    if (this.statement !== null) {
      context.trace(`Verifying the '${premiseString}' premise...`);

      const stated = true,
            assignments = [],
            statementVerified = this.statement.verify(assignments, stated, context);

      if (statementVerified) {
        const assignmentsAssigned = assignAssignments(assignments, context);

        if (assignmentsAssigned) {
          const { ProofStep } = shim,
                proofStep = ProofStep.fromStatement(this.statement);

          context.addProofStep(proofStep);

          verified = true;
        }
      }

      if (verified) {
        context.debug(`...verified the '${premiseString}' premise.`);
      }
    } else {
      context.debug(`Unable to verify the '${premiseString}' premise because it is nonsense.`);
    }

    return verified;
  }

  toJSON() {
    const statementJSON = statementToStatementJSON(this.statement),
          statement = statementJSON,  ///
          json = {
            statement
          };

    return json;
  }

  static fromJSON(json, fileContext) {
    const statement = statementFromJSON(json, fileContext),
          string = statement.getString(),
          premise = new Premise(string, statement);

    return premise;
  }

  static fromPremiseNode(suppositionNode, fileContext) {
    const { Statement } = shim,
          statement = Statement.fromPremiseNode(premiseNode, fileContext),
          node = suppositionNode, ///
          string = fileContext.nodeAsString(node),
          premise = new Premise(string, statement);

    return premise
  }
}

Object.assign(shim, {
  Premise
});

export default Premise;
