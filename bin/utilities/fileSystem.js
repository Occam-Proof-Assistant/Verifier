"use strict";

const fs = require("fs");

const { Query } = require("occam-dom"),
      { filePathUtilities } = require("occam-open-cli"),
      { fileSystemUtilities } = require("necessary"),
      { MetaJSONLexer, MetaJSONParser } = require("occam-grammars");

const { isFilePathFlorenceFilePath } = filePathUtilities,
      { readFile, isEntryFile, isEntryDirectory, checkFileExists } = fileSystemUtilities;

const metaJSONLexer = MetaJSONLexer.fromNothing(),
      metaJSONParser = MetaJSONParser.fromNothing(),
      dependencyStringLiteralNodesQuery = Query.fromExpression("//dependency//@string-literal");

function filePathsFromPackageName(packageName) {
  const directoryName = packageName,  ///
        filePaths = readFilePaths(directoryName, (filePath) => {
          const filePathFlorenceFilePath = isFilePathFlorenceFilePath(filePath);

          if (filePathFlorenceFilePath) {
            return true;
          }
        });

  return filePaths;
}

function dependencyPackageNamesFromPackageName(packageName) {
  let dependencyPackageNames = [];

  const directoryName = packageName,  ///
        metaJSONFilePath = `${directoryName}/meta.json`,
        metaJSONFileExists = checkFileExists(metaJSONFilePath);

  if (metaJSONFileExists) {
    const metaJSONFileContent = readFile(metaJSONFilePath),
          content = metaJSONFileContent,  ///
          tokens = metaJSONLexer.tokenise(content),
          node = metaJSONParser.parse(tokens),
          dependencyStringLiteralNodes = dependencyStringLiteralNodesQuery.execute(node);

    dependencyPackageNames = dependencyStringLiteralNodes.map((dependencyStringLiteralNode) => {
      const dependencyStringLiteralNodeContent = dependencyStringLiteralNode.getContent(),
            dependencyPackageName = trimDoubleQuotes(dependencyStringLiteralNodeContent); ///

      return dependencyPackageName;
    });
  }

  return dependencyPackageNames;
}

module.exports = {
  filePathsFromPackageName,
  dependencyPackageNamesFromPackageName
};

function trimDoubleQuotes(content) { return content.replace(/(^"|"$)/g, ""); } ///

function readFilePaths(directoryPath, test, filePaths = []) {
  const subEntryNames = fs.readdirSync(directoryPath);

  subEntryNames.forEach((subEntryName) => {
    const subEntryNameHiddenName = isNameHiddenName(subEntryName);

    if (!subEntryNameHiddenName) {
      const subEntryPath = `${directoryPath}/${subEntryName}`,
            subEntryFile = isEntryFile(subEntryPath),
            subEntryDirectory = isEntryDirectory(subEntryPath);

      if (subEntryFile) {
        const filePath = subEntryPath,  ///
              pass = test(filePath);

        if (pass) {
          filePaths.push(filePath);
        }
      }

      if (subEntryDirectory) {
        const subDirectoryPath = subEntryPath;  ///

        readFilePaths(subDirectoryPath, test, filePaths);
      }
    }
  });

  return filePaths;
}

function isNameHiddenName(name) {
  const nameHiddenName = /^\..+/.test(name);

  return nameHiddenName;
}
