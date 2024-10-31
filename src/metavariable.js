"use strict";

import shim from "./shim";
import LocalContext from "./context/local";
import FrameSubstitution from "./substitution/frame";
import StatementSubstitution from "./substitution/statement";
import MetavariableNodeAndTokens from "./nodeAndTokens/metavariable";

import { nodeQuery } from "./utilities/query";
import { EMPTY_STRING } from "./constants";
import { unifyMetavariable } from "./utilities/unification";
import { metaTypeFromJSON, metaTypeToMetaTypeJSON } from "./utilities/json";
import { typeNameFromTypeNode, metavariableNameFromMetavariableNode } from "./utilities/name";

const termNodeQuery = nodeQuery("/metavariable/argument/term"),
      typeNodeQuery = nodeQuery("/metavariable/argument/type"),
      metaTypeNodeQuery = nodeQuery("/metavariableDeclaration/metaType"),
      metavariableNodeQuery = nodeQuery("/metavariableDeclaration/metavariable"),
      frameMetavariableNodeQuery = nodeQuery("/frame/metavariable!"),
      statementMetavariableNodeQuery = nodeQuery("/statement/metavariable!");

class Metavariable {
  constructor(string, name, node, tokens, metaType) {
    this.string = string;
    this.name = name;
    this.node = node;
    this.tokens = tokens;
    this.metaType = metaType;
  }

  getString() {
    return this.string;
  }

  getName() {
    return this.name;
  }

  getNode() {
    return this.node;
  }

  getTokens() {
    return this.tokens;
  }

  getMetaType() {
    return this.metaType;
  }

  matchMetaType(metaType) {
    const metaTypeMatches = (this.metaType === metaType);

    return metaTypeMatches;
  }

  matchMetavariableName(metavariableName) {
    const metavariableNameMatches = (this.name === metavariableName);

    return metavariableNameMatches;
  }

  matchMetavariableNode(metavariableNode) {
    const metavariableNodeMatches = this.node.match(metavariableNode);

    return metavariableNodeMatches;
  }

  unifyFrame(frame, substitutions, generalContext, specificContext) {
    let frameUnified = false;

    const frameNode = frame.getNode(),
          frameString = frame.getString(),
          metavariableString = this.string; ///

    specificContext.trace(`Unifying the '${frameString}' frame with the '${metavariableString}' metavariable...`);

    const metavariableNode = this.node, ///
          simpleSubstitutionPresent = substitutions.isSimpleSubstitutionPresentByMetavariableNode(metavariableNode);

    if (simpleSubstitutionPresent) {
      const simpleSubstitution = substitutions.findSimpleSubstitutionByMetavariableNode(metavariableNode),
            substitution = simpleSubstitution,  ///
            frameNodeMatches = substitution.matchFrameNode(frameNode);

      if (frameNodeMatches) {
        frameUnified = true;
      }
    } else {
      let context;

      context = generalContext; ///

      const localContext = LocalContext.fromContextAndTokens(context, this.tokens);

      generalContext = localContext;  ///

      const metavariableNode = this.node,  ///
            metavariable = metavariableFromMetavariableNode(metavariableNode, generalContext, specificContext),
            frameMetavariable  = frameMetavariableFromStatementNode(frameNode, generalContext, specificContext);

      if ((metavariable !== null) && (metavariable === frameMetavariable)) {
        frameUnified = true;
      } else {
        context = specificContext;  ///

        const metavariable = this,  ///
              frameSubstitution = FrameSubstitution.fromFrameAndMetavariable(frame, metavariable, context),
              substitution = frameSubstitution;  ///

        substitutions.addSubstitution(substitution, context);

        frameUnified = true;
      }
    }

    if (frameUnified) {
      specificContext.debug(`...unified the '${frameString}' frame with the '${metavariableString}' metavariable.`);
    }

    return frameUnified;
  }

  unifyStatement(statement, substitution, substitutions, generalContext, specificContext) {
    let statementUnified = false;

    const statementString = statement.getString(),
          metavariableString = this.string, ///
          substitutionString = (substitution !== null) ?
                                  substitution.getString() :
                                    EMPTY_STRING;

    specificContext.trace(`Unifying the '${statementString}' statement with the '${metavariableString}${substitutionString}' metavariable...`);

    const statementNode = statement.getNode(),
          metavariableNode = this.node, ///
          substitutionNode = (substitution !== null) ?
                                substitution.getNode() :
                                  null,
          substitutionPresent = substitutions.isSubstitutionPresentByMetavariableNodeAndSubstitutionNode(metavariableNode, substitutionNode);

    if (substitutionPresent) {
      const substitution = substitutions.findSubstitutionByMetavariableNodeAndSubstitutionNode(metavariableNode, substitutionNode),
            statementNodeMatches = substitution.matchStatementNode(statementNode);

      if (statementNodeMatches) {
        statementUnified = true;
      }
    } else {
      let context;

      context = generalContext; ///

      const localContext = LocalContext.fromContextAndTokens(context, this.tokens);

      generalContext = localContext;  ///

      const metavariableNode = this.node,  ///
            metavariable = metavariableFromMetavariableNode(metavariableNode, generalContext, specificContext),
            statementMetavariable = statementMetavariableFromStatementNode(statementNode, generalContext, specificContext);

      if ((metavariable !== null) && (metavariable === statementMetavariable)) {
        statementUnified = true;
      } else {
        context = specificContext;  ///

        const metavariable = this,  ///
              statementSubstitution = StatementSubstitution.fromStatementMetavariableAndSubstitution(statement, metavariable, substitution, context);

        substitution = statementSubstitution;  ///

        substitutions.addSubstitution(substitution, context);

        statementUnified = true;
      }
    }

    if (statementUnified) {
      specificContext.debug(`...unified the '${statementString}' statement with the '${metavariableString}${substitutionString}' metavariable.`);
    }

    return statementUnified;
  }

  unifyMetavariable(metavariable, generalContext, specificContext) {
    let metavariableUnified;

    const generalMetavariable = this, ///
          specificMetavariable = metavariable,  ///
          generalMetavariableString = generalMetavariable.getString(),
          specificMetavariableString = specificMetavariable.getString();

    specificContext.trace(`Unifying the '${specificMetavariableString}' metavariable against the '${generalMetavariableString}' metavariable...`);

    metavariableUnified = unifyMetavariable(generalMetavariable, specificMetavariable, generalContext, specificContext);

    if (metavariableUnified) {
      specificContext.debug(`...unified the '${specificMetavariableString}' metavariable against the '${generalMetavariableString}' metavariable.`);
    }

    return metavariableUnified;
  }

  unifySubstitution(substitution, context) {
    let substitutionUnified = false;

    const metavariableString = this.string,  ///
          substitutionString = substitution.getString();

    context.trace(`Unifying the '${substitutionString}' substitution with the '${metavariableString}' metavariable...`);

    const metavariableNode = this.node, ///
          judgement = context.findJudgementByMetavariableNode(metavariableNode);

    if (judgement !== null){
      const declaration = judgement.getDeclaration();

      substitutionUnified = declaration.unifySubstitution(substitution, context);
    }

    if (substitutionUnified) {
      context.debug(`...unified the '${substitutionString}' substitution with the '${metavariableString}' metavariable.`);
    }

    return substitutionUnified;
  }

  verify(context) {
    let verified;

    const metavariableString = this.string; ///

    context.trace(`Verifying the '${metavariableString}' metavariable...`);

    const metavariableNode = this.node,
          specificContext = context,  ///
          generalContext = context,  ///
          metavariablePresent = generalContext.isMetavariablePresentByMetavariableNode(metavariableNode, generalContext, specificContext);

    verified = metavariablePresent; ///

    if (verified) {
      context.debug(`...verified the '${metavariableString}' metavariable.`);
    }

    return verified;
  }

  verifyWhenDeclared(fileContext) {
    let verifiedAtTopLevel = false;

    const metavariableString = this.string; ///

    fileContext.trace(`Verifying the '${metavariableString}' metavariable when declared...`);

    const metavariableNode = this.node, ///
          metavariableName = metavariableNameFromMetavariableNode(metavariableNode),
          metavariablePresent = fileContext.isMetavariablePresentByMetavariableName(metavariableName);

    if (metavariablePresent) {
      fileContext.debug(`The metavariable '${metavariableString}' is already present.`);
    } else {
      const termNode = termNodeQuery(this.node);

      if (termNode !== null) {
        fileContext.debug(`A term was found in the '${metavariableString}' metavariable when a type should have been present.`);
      } else {
        const typeNode = typeNodeQuery(this.node);

        if (typeNode !== null) {
          const typeName = typeNameFromTypeNode(typeNode),
                typePresent = fileContext.isTypePresentByTypeName(typeName);

          if (typePresent) {
            verifiedAtTopLevel = true;
          } else {
            fileContext.debug(`The '${typeName}' type is not present.`);
          }
        } else {
          verifiedAtTopLevel = true;
        }
      }
    }

    if (verifiedAtTopLevel) {
      fileContext.debug(`...verified the '${metavariableString}' metavariable when declared.`);
    }

    return verifiedAtTopLevel;
  }

  verifyGivenMetaType(metaType, context) {
    let verifiedGivenMetaType = false;

    const metavariableString = this.string,  ///
          metaTypeString = metaType.getString();

    context.trace(`Verifying the '${metavariableString}' metavariable given the '${metaTypeString}' meta-type...`);

    const metavariableNode = this.node,  ///
          specificContext = context,  ///
          generalContext = context, ///
          metavariable = generalContext.findMetavariableByMetavariableNode(metavariableNode, generalContext, specificContext);

    if (metavariable !== null) {
      const metaTypeMatches = metavariable.matchMetaType(metaType);

      verifiedGivenMetaType = metaTypeMatches;  ///
    }

    if (verifiedGivenMetaType) {
      context.debug(`...verified the '${metavariableString}' metavariable given the '${metaTypeString}' meta-type.`);
    }

    return verifiedGivenMetaType;
  }

  toJSON() {
    const metaTypeJSON = metaTypeToMetaTypeJSON(this.metaType),
          metaType = metaTypeJSON,  ///
          string = this.string,
          json = {
            string,
            metaType
          };

    return json;
  }

  static fromJSON(json, fileContext) {
    const { string } = json,
          context = fileContext,  ///
          metavariableNodeAndTokens = MetavariableNodeAndTokens.fromString(string, context),
          metavariableTokens = metavariableNodeAndTokens.getMetavariableTokens(),
          metavariableNode = metavariableNodeAndTokens.getMetavariableNode(),
          metavariableName = metavariableNameFromMetavariableNode(metavariableNode),
          name = metavariableName,  ///
          node = metavariableNode,  ///
          tokens = metavariableTokens, ///
          metaType = metaTypeFromJSON(json, fileContext),
          metavariable = new Metavariable(string, name, node, tokens, metaType);

    return metavariable;
  }

  static fromStatementNode(statementNode, context) {
    let metavariable = null;

    const statementMetavariableNode = statementMetavariableNodeQuery(statementNode);

    if (statementMetavariableNode !== null) {
      let metavariableNode = statementMetavariableNode; ///

      const metavariableString = context.nodeAsString(metavariableNode),
            string = metavariableString,  ///
            metavariableNodeAndTokens = MetavariableNodeAndTokens.fromString(string, context),
            metavariableTokens = metavariableNodeAndTokens.getMetavariableTokens(),
            metavariableName = metavariableNameFromMetavariableNode(metavariableNode);

      metavariableNode = metavariableNodeAndTokens.getMetavariableNode();

      const name = metavariableName,  ///
            node = metavariableNode,  ///
            tokens = metavariableTokens, ///
            metaType = null;

      metavariable = new Metavariable(string, name, node, tokens, metaType);
    }

    return metavariable;
  }

  static fromMetavariableNode(metavariableNode, context) {
    let metavariable = null;

    if (metavariableNode !== null) {
      const metavariableString = context.nodeAsString(metavariableNode),
            string = metavariableString,  ///
            metavariableNodeAndTokens = MetavariableNodeAndTokens.fromString(string, context),
            metavariableTokens = metavariableNodeAndTokens.getMetavariableTokens(),
            metavariableName = metavariableNameFromMetavariableNode(metavariableNode);

      metavariableNode = metavariableNodeAndTokens.getMetavariableNode();

      const name = metavariableName,  ///
            node = metavariableNode,  ///
            tokens = metavariableTokens, ///
            metaType = null;

      metavariable = new Metavariable(string, name, node, tokens, metaType);
    }

    return metavariable;
  }

  static fromMetavariableDeclarationNode(metavariableDeclarationNode, fileContext) {
    let metavariableNode;

    const { MetaType } = shim,
          metaTypeNode = metaTypeNodeQuery(metavariableDeclarationNode);

    metavariableNode = metavariableNodeQuery(metavariableDeclarationNode);

    const localContext = LocalContext.fromFileContext(fileContext),
          context = localContext, ///
          metavariableString = fileContext.nodeAsString(metavariableNode),
          string = metavariableString,  ///
          metavariableNodeAndTokens = MetavariableNodeAndTokens.fromString(string, context),
          metavariableTokens = metavariableNodeAndTokens.getMetavariableTokens(),
          metavariableName = metavariableNameFromMetavariableNode(metavariableNode);

    metavariableNode = metavariableNodeAndTokens.getMetavariableNode();

    const name = metavariableName,  ///
          node = metavariableNode,  ///
          tokens = metavariableTokens, ///
          metaType = MetaType.fromMetaTypeNode(metaTypeNode, context),
          metavariable = new Metavariable(string, name, node, tokens, metaType);

    return metavariable;
  }
}

Object.assign(shim, {
  Metavariable
});

export default Metavariable;

function metavariableFromMetavariableNode(metavariableNode, generalContext, specificContext) {
  const metavariable = generalContext.findMetavariableByMetavariableNode(metavariableNode, generalContext, specificContext);

  return metavariable;
}

function frameMetavariableFromStatementNode(frameNode, generalContext, specificContext) {
  let frameMetavariable = null;

  const frameMetavariableNode = frameMetavariableNodeQuery(frameNode);

  if (frameMetavariableNode !== null) {
    frameMetavariable = generalContext.findMetavariableByMetavariableNode(frameMetavariableNode, generalContext, specificContext);
  }

  return frameMetavariable;
}

function statementMetavariableFromStatementNode(statementNode, generalContext, specificContext) {
  let statementMetavariable = null;

  const statementMetavariableNode = statementMetavariableNodeQuery(statementNode);

  if (statementMetavariableNode !== null) {
    statementMetavariable = generalContext.findMetavariableByMetavariableNode(statementMetavariableNode, generalContext, specificContext);
  }

  return statementMetavariable;
}
