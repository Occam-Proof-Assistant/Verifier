"use strict";

import MetaType from "./metaType";

import { nodeAsString } from "./utilities/string";

export default class Metavariable {
  constructor(node, metaType) {
    this.node = node;
    this.metaType = metaType;
  }

  getNode() {
    return this.node;
  }

  getMetaType() {
    return this.metaType;
  }

  matchNode(node) {
    const nodeMatches = this.node.match(node);

    return nodeMatches;
  }

  toJSON(tokens) {
    const metaTypeJSON = this.metaType.toJSON(tokens),
          metaType = metaTypeJSON,  ///
          string = nodeAsString(this.node, tokens),
          node = string,  ///
          json = {
            node,
            metaType
          };

    return json;
  }

  asString(tokens) {
    const metaTypeName = this.metaType.getName();

    let string = nodeAsString(this.node, tokens);

    string = `${string}:${metaTypeName}`;

    return string;
  }

  static fromJSONAndFileContext(json, fileContext) {
    const { node } = json;

    let { metaType } = json;

    json = metaType;  ///

    metaType = MetaType.fromJSONAndFileContext(json, fileContext);

    const metaTypeName = metaType.getName();

    metaType = fileContext.findMetaTypeByMetaTypeName(metaTypeName); ///

    const metavariable = new Metavariable(node, metaType);

    return metavariable;
  }

  static fromMetavariableNodeAndMetaType(metavariableNode, metaType) {
    const node = metavariableNode,  ///
          metavariable = new Metavariable(node, metaType);

    return metavariable;
  }
}
