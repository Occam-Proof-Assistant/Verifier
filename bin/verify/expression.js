'use strict';

const parsers = require('occam-parsers');

const Error = require('../error'),
      emptyType = require('../miscellaneous/emptyType'),
      ruleNames = require('../miscellaneous/ruleNames'),
			verifyTerm = require('../verify/term'),
      nodeUtilities = require('../utilities/node'),
      ruleUtilities = require('../utilities/rule'),
      Configuration = require('../miscellaneous/configuration');

const { partTypes } = parsers,
      { findRuleByName } = ruleUtilities,
      { RuleNamePartType,
        OptionalPartPartType,
        GroupOfPartsPartType,
        ChoiceOfPartsPartType,
        OneOrMorePartsPartType,
        ZeroOrMorePartsPartType } = partTypes,
			{ nodeAsString, cloneChildNodes } = nodeUtilities,
			{ TERM_RULE_NAME, EXPRESSION_RULE_NAME } = ruleNames;

function verifyExpression(expressionNode, context, rules) {
  const expressionRule = findRuleByName('expression', rules),
        node = expressionNode,  ///
        rule = expressionRule,  ///
        type = verifyWithRule(node, rule, context, rules);

  if (type === undefined) {
    const node = expressionNode,  ///
          expressionString = nodeAsString(expressionNode),
          message = `The expression '${expressionString}' cannot be verified.`;

    throw new Error(node, message);
  }

  return type;
}

module.exports = verifyExpression;

function verifyWithRule(node, rule, context, rules) {
  let type = undefined;

  const definitions = rule.getDefinitions();

  definitions.some((definition) => {
    type = verifyWithDefinition(node, definition, context, rules);

    if (type !== undefined) {
      return true;
    }
  });

  return type;
}

function verifyWithDefinition(node, definition, context, rules) {
  const parts = definition.getParts(),
        childNodes = cloneChildNodes(node),
        type = verifyWithParts(childNodes, parts, context, rules);

  return type;
}

function verifyWithParts(childNodes, parts, context, rules) {
  let type = undefined;

  parts.some((part) => {
    const partTerminalPart = part.isTerminalPart();

    let partType;

    if (partTerminalPart) {
      const terminalPart = part;  ///

      partType = verifyWithTerminalPart(childNodes, terminalPart, context, rules);
    } else {
      const nonTerminalPart = part; ///

      partType = verifyWithNonTerminalPart(childNodes, nonTerminalPart, context, rules);
    }

    if (partType === undefined) {
      type = undefined;

      return true;
    }

    if (type === undefined) {
      type = partType;  ///
    } else {
      if (partType !== emptyType) {
        const partTypeEqualToType = partType.isEqualTo(type);

        if (!partTypeEqualToType) {
          const partTypeSubTypeOfType = partType.isSubTypeOf(type);

          if (!partTypeSubTypeOfType) {
            const typeSubTypeOfPartType = type.isSubTypeOf(partType);

            if (typeSubTypeOfPartType) {
              type = partType;
            } else {
              type = undefined;

              return true;
            }
          }
        }
      }
    }
  });

  return type;
}

function verifyWithRuleNamePart(childNodes, ruleNamePart, context, rules) {
  let type = undefined;

  const childNode = childNodes.shift();

  if (childNode !== undefined) {
    const childNodeNonTerminalNode = childNode.isNonTerminalNode();

    if (childNodeNonTerminalNode) {
      const ruleName = ruleNamePart.getRuleName(),
		        nonTerminalNode = childNode,  ///
            nonTerminalNodeRuleName = nonTerminalNode.getRuleName();

      if (ruleName === nonTerminalNodeRuleName) {
	      switch (ruleName) {
		      case TERM_RULE_NAME : {
			      const termNode = nonTerminalNode;  ///

			      type = verifyTerm(termNode, context, rules);
		      	break;
		      }

		      case EXPRESSION_RULE_NAME : {
			      const expressionNode = nonTerminalNode;  ///

			      type = verifyExpression(expressionNode, context, rules);
			      break;
		      }

		      default : {
		      	const name = ruleName,  ///
					        node = nonTerminalNode, ///
					        rule = findRuleByName(name, rules);

		      	type = verifyWithRule(node, rule, context, rules);
		      }
	      }
      }
    }
  }

  return type;
}

function verifyWithTerminalPart(childNodes, terminalPart, context, rules) {
  let type = undefined;

  const childNode = childNodes.shift();

  if (childNode !== undefined) {
    const childNodeTerminalNode = childNode.isTerminalNode();

    if (childNodeTerminalNode) {
      let terminalNode = childNode; ///

      const significantToken = terminalNode.getSignificantToken(),
            configuration = Configuration.fromSignificantToken(significantToken);

      terminalNode = terminalPart.parse(configuration);

      if (terminalNode !== undefined) {
        type = emptyType; ///
      }
    }
  }

  return type;
}

function verifyWithNonTerminalPart(childNodes, nonTerminalPart, context, rules) {
  let type = undefined;

  const nonTerminalPartType = nonTerminalPart.getType();

  switch (nonTerminalPartType) {
    case RuleNamePartType:
      const ruleNamePart = nonTerminalPart;  ///

      type = verifyWithRuleNamePart(childNodes, ruleNamePart, context, rules);
      break;

    default:

      debugger
  }

  return type;
}
