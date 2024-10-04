"use strict";

import shim from "./shim";
import Type from "./type";
import termAsConstructorVerifier from "./verifier/termAsConstructor";

import { filter } from "./utilities/array";
import { nodesQuery } from "./utilities/query"
import { termNodeFromTermString } from "./utilities/node";

const variableNodesQuery = nodesQuery("//variable");

class Term {
  constructor(string, node, type) {
    this.string = string;
    this.node = node;
    this.type = type;
  }

  getString() {
    return this.string;
  }

  getNode() {
    return this.node;
  }

  getType() {
    return this.type;
  }

  match(term) {
    const node = term.getNode(),
          matches = this.node.match(node);

    return matches;
  }

  getVariables(localContext) {
    const variables = [],
          variableNodes = variableNodesQuery(this.node);

    variableNodes.forEach((variableNode) => {
      const variable = localContext.findVariableByVariableNode(variableNode),
            variablesIncludesVariable = variables.includes(variable);

      if (!variablesIncludesVariable) {
        variables.push(variable);
      }
    });

    return variables;
  }

  isGrounded(definedVariables, localContext) {
    const variables = this.getVariables(localContext);

    filter(variables, (variable) => {
      const definedVariablesIncludesVariable = definedVariables.includes(variable);

      if (!definedVariablesIncludesVariable) {
        return true;
      }
    });

    const undefinedVariables = variables, ///
          undefinedVariablesLength = undefinedVariables.length,
          grounded = (undefinedVariablesLength <= 1);

    return grounded;
  }

  matchTermNode(termNode) {
    const termNodeMatches = this.node.match(termNode);

    return termNodeMatches;
  }

  isInitiallyGrounded(localContext) {
    const variables = this.getVariables(localContext),
          variablesLength = variables.length,
          initiallyGrounded = (variablesLength === 0);

    return initiallyGrounded;
  }

  isImplicitlyGrounded(definedVariables, localContext) {
    const grounded = this.isGrounded(definedVariables, localContext),
          implicitlyGrounded = grounded;  ///

    return implicitlyGrounded;
  }

  verify(fileContext) {
    let verified = false;

    const termString = this.string; ///

    fileContext.trace(`Verifying the '${termString}' term...`);

    debugger

    if (verified) {
      fileContext.debug(`...verified the '${termString}' type.`);
    }

    return verified;
  }

  verifyType(fileContext) {
    let typeVerified;

    if (this.type === null) {
      typeVerified = true;
    } else {
      const typeName = this.type.getName();

      fileContext.trace(`Verifying the '${typeName}' type...`);

      const type = fileContext.findTypeByTypeName(typeName);

      if (type === null) {
        fileContext.debug(`The '${typeName}' type is missing.`);
      } else {
        this.type = type; ///

        typeVerified = true;
      }

      if (typeVerified) {
        fileContext.debug(`...verified the '${typeName}' type.`);
      }
    }

    return typeVerified;
  }

  verifyAsConstructor(fileContext) {
    let verifiedAsConstructor;

    const termString = this.string;  ///

    fileContext.trace(`Verifying the '${termString}' term as a constructor...`);

    const termNode = this.node;  ///

    verifiedAsConstructor = termAsConstructorVerifier.verifyTerm(termNode, fileContext);

    if (verifiedAsConstructor) {
      fileContext.debug(`...verified the '${termString}' term as a constructor.`, termNode);
    }

    return verifiedAsConstructor;
  }

  toJSON() {
    const typeJSON = (this.type !== null) ?
                       this.type.toJSON() :
                         null,
          string = this.string,
          type = typeJSON,  ///
          json = {
            string,
            type
          };

    return json;
  }

  static fromJSON(json, fileContext) {
    const { string } = json,
          termString = string,  ///
          lexer = fileContext.getLexer(),
          parser = fileContext.getParser(),
          termNode = termNodeFromTermString(termString, lexer, parser),
          node = termNode;

    let { type } = json;

    const typeJSON = type;  ///

    json = typeJSON;  ///

    type = (json !== null) ?
             Type.fromJSON(json, fileContext) :
               null;

    const term = new Term(string, node, type);

    return term;
  }

  static fromTermNode(termNode, fileContext) {
    const node = termNode,  ///
          string = fileContext.nodeAsString(node),
          type = null,
          term = new Term(string, node, type);

    return term;
  }

  static fromTermNodeAndType(termNode, type, fileContext) {
    const node = termNode,  ///
          string = fileContext.nodeAsString(node),
          term = new Term(string, node, type);

    return term;
  }
}

Object.assign(shim, {
  Term
});

export default Term;