"use strict";

import Metavariable from "../../metavariable";
import MetavariableAssignment from "../../assignment/metavariable";

import { first } from "../../utilities/array";
import { nodeQuery } from "../../utilities/query";
import { nameFromMetavariableNode } from "../../utilities/name";

const termNodeQuery = nodeQuery("/argument/term"),
      typeNodeQuery = nodeQuery("/argument/type"),
      argumentNodeQuery = nodeQuery("/metavariable/argument!"),
      metaTypeNodeQuery = nodeQuery("/metavariableDeclaration/metaType"),
      metavariableNodeQuery = nodeQuery("/metavariableDeclaration/metavariable");

export default function verifyMetavariableDeclaration(metavariableDeclarationNode, fileContext) {
  let metavariableDeclarationVerified;

  const metaTypeNode = metaTypeNodeQuery(metavariableDeclarationNode),
        metavariableNode = metavariableNodeQuery(metavariableDeclarationNode),
        metaTypeString = fileContext.nodeAsString(metaTypeNode),
        metavariableString = fileContext.nodeAsString(metavariableNode);

  fileContext.trace(`Verifying the '${metavariableString}:${metaTypeString}' metavariable declaration...`, metavariableDeclarationNode);

  const metavariableVVerified = verifyMetavariable(metavariableNode, metaTypeNode, fileContext);

  metavariableDeclarationVerified = metavariableVVerified;  ///

  if (metavariableDeclarationVerified) {
    fileContext.debug(`...verified the '${metavariableString}:${metaTypeString}' metavariable declaration.`, metavariableDeclarationNode);
  }

  return metavariableDeclarationVerified;
}

function verifyMetavariable(metavariableNode, metaTypeNode, fileContext) {
  let metavariableVerified = false;

  const metavariableString = fileContext.nodeAsString(metavariableNode);

  fileContext.trace(`Verifying the '${metavariableString}' metavariable...`, metavariableNode);

  const metavariablePresent = fileContext.isMetavariablePresentByMetavariableNode(metavariableNode);

  if (metavariablePresent) {
    fileContext.debug(`The metavariable '${metavariableString}' is already present.`, metavariableNode);
  } else {
    const termTypes = [],
      metaTypes = [],
      argumentNode = argumentNodeQuery(metavariableNode),
      argumentVerified = verifyArgument(argumentNode, termTypes, fileContext),
      metaTypeVerified = verifyMetaType(metaTypeNode, metaTypes, fileContext);

    if (argumentVerified && metaTypeVerified) {
      let termType,
        metaType;

      const firstMetaType = first(metaTypes);

      metaType = firstMetaType; ///

      const termTypesLength = termTypes.length;

      if (termTypesLength === 0) {
        termType = null;
      } else {
        const firstTermType = first(termTypes);

        termType = firstTermType; ///
      }

      const node = metavariableNode,  ///
        name = nameFromMetavariableNode(metavariableNode),
        metavariable = Metavariable.fromNodeNameTermTypeAndMetaType(node, name, termType, metaType),
        metavariableAssignment = MetavariableAssignment.fromMetavariable(metavariable),
        metavariableAssigned = metavariableAssignment.assign(fileContext);

      if (metavariableAssigned) {
        metavariableVerified = true;
      }
    }
  }

  if (metavariableVerified) {
    fileContext.debug(`...verified the '${metavariableString}' metavariable.`, metavariableNode);
  }

  return metavariableVerified;
}

function verifyArgument(argumentNode, termTypes, fileContext) {
  let argumentVerified = false;

  if (argumentNode === null) {
    argumentVerified = true;
  } else {
    const termNode = termNodeQuery(argumentNode);

    if (termNode === null) {

    } else {
      const termString = fileContext.nodeAsString(termNode);

      fileContext.debug(`The '${termString}' term was found when a type should have been present.`, termNode);
    }
    const typeNode = typeNodeQuery(argumentNode);

    if (typeNode !== null) {
      const type = fileContext.findTypeByTypeNode(typeNode);

      if (type !== null) {
        const termType = type;  ///

        termTypes.push(termType);

        argumentVerified = true;
      } else {
        const typeString = fileContext.nodeAsString(typeNode);

        fileContext.debug(`The '${typeString}' type is not present.`, typeNode);
      }
    }
  }

  return argumentVerified;
}

function verifyMetaType(metaTypeNode, metaTypes, fileContext) {
  let metaTypeVerified;

  const metaType = fileContext.findMetaTypeByMetaTypeNode(metaTypeNode);

  metaTypes.push(metaType);

  metaTypeVerified = true;

  return metaTypeVerified;
}