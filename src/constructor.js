"use strict";

import Type from "./type";

import { nodeAsString } from "./utilities/string";
import { CONSTRUCTOR_KIND } from "./kinds";
import { termNodeFromTermJSON } from "./utilities/node";

export default class Constructor {
  constructor(termNode, type) {
    this.termNode = termNode;
    this.type = type;
  }

  getTermNode() {
    return this.termNode;
  }

  getType() {
    return this.type;
  }

  asString() {
    let string;

    const termString = nodeAsString(this.termNode);

    if (this.type === null) {
      string = `${termString}`;
    } else {
      const noSuperType = true,
            typeString = this.type.asString(noSuperType);

      string = `${termString}:${typeString}`;
    }

    return string;
  }

  toJSON() {
    const termString = nodeAsString(this.termNode),
          typeJSON = (this.type === null) ?
                        null :
                          this.type.toJSON(),
          kind = CONSTRUCTOR_KIND,
          term = termString,  ///
          type = typeJSON,  ///
          json = {
            kind,
            term,
            type
          };

    return json;
  }

  static fromJSON(json, releaseContext) {
    const { term } = json,
          termJSON = term,  ///
          termNode = termNodeFromTermJSON(termJSON, releaseContext);

    let { type } = json;

    const typeJSON = type;  ///

    json = typeJSON;  ///

    type = Type.fromJSON(json, releaseContext);

    const typeName = type.getName();

    type = releaseContext.findTypeByTypeName(typeName); ///

    const constructor = new Constructor(termNode, type);

    return constructor;
  }

  static fromTermNodeAndType(termNode, type) {
    const constructor = new Constructor(termNode, type);

    return constructor;
  }
}
