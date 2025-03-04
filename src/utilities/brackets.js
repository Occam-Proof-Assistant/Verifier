"use strict";

import dom from "../dom";
import LocalContext from "../context/local";
import combinatorBracketedContext from "../context/bracketed/combinator";
import constructorBracketedContext from "../context/bracketed/constructor";

import { nodeQuery } from "../utilities/query";
import { BRACKETED_TERM_DEPTH, BRACKETED_STATEMENT_DEPTH } from "../constants";

const bracketedTermChildNodeQuery = nodeQuery("/term/argument/term"),
      bracketedStatementChildNodeQuery = nodeQuery("/statement/metaArgument/statement");

export function stripBracketsFromTerm(term, context) {
  const termNode = term.getNode(),
        bracketedTermChildNode = bracketedTermChildNodeFromTermNode(termNode);

  if (bracketedTermChildNode !== null) {
    const { Term } = dom,
          termNode = bracketedTermChildNode;  ///

    term = Term.fromStatementNode(termNode, context);
  }

  return term;
}

export function stripBracketsFromStatement(statement, context) {
  const statementNode = statement.getNode(),
        bracketedStatementChildNode = bracketedStatementChildNodeFromStatementNode(statementNode);

  if (bracketedStatementChildNode !== null) {
    context = contextFromStatement(statement, context); ///

    const { Statement } = dom,
          statementNode = bracketedStatementChildNode;  ///

    statement = Statement.fromStatementNode(statementNode, context);
  }

  return statement;
}

export function stripBracketsFromTermNode(termNode) {
  const bracketedTermChildNode = bracketedTermChildNodeFromTermNode(termNode);

  if (bracketedTermChildNode !== null) {
    termNode = bracketedTermChildNode;  ///
  }

  return termNode;
}

export function stripBracketsFromStatementNode(statementNode) {
  const bracketedStatementChildNode = bracketedStatementChildNodeFromStatementNode(statementNode);

  if (bracketedStatementChildNode !== null) {
    statementNode = bracketedStatementChildNode;  ///
  }

  return statementNode;
}

export function bracketedTermChildNodeFromTermNode(termNode) {
  let bracketedTermChildNode = null;

  const depth = BRACKETED_TERM_DEPTH,
        bracketedTermNode = constructorBracketedContext.getBracketedTermNode(),
        termNodeMatchBracketedTermNode = termNode.match(bracketedTermNode, depth);

  if (termNodeMatchBracketedTermNode) {
    bracketedTermChildNode = bracketedTermChildNodeQuery(termNode);
  }

  return bracketedTermChildNode;
}

export function bracketedStatementChildNodeFromStatementNode(statementNode) {
  let bracketedStatementChildNode = null;

  const depth = BRACKETED_STATEMENT_DEPTH,
        bracketedStatementNode = combinatorBracketedContext.getBracketedStatementNode(),
        statementNodeMatchBracketedStatementNode = statementNode.match(bracketedStatementNode, depth);

  if (statementNodeMatchBracketedStatementNode) {
    bracketedStatementChildNode = bracketedStatementChildNodeQuery(statementNode);
  }

  return bracketedStatementChildNode;
}

function contextFromStatement(statement, context) {
  const statementTokens = statement.getTokens(),
    tokens = statementTokens, ///
    localContext = LocalContext.fromContextAndTokens(context, tokens);

  context = localContext; ///

  return context;
}
