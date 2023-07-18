import * as vscode from 'vscode';
import * as cases from 'change-case';
import { EOL } from 'os';


const extensionNamespace = 'extension.changeCase';

const caseTypes = {
  upper:'upper',
  lower:'lower',
  camel: 'camel',
  capital: 'capital',
  constant: 'constant',
  dot: 'dot',
  header: 'header',
  none:'none',
  param: 'param',
  pascal: 'pascal',
  sentence: 'sentence',
  snake: 'snake',
};

const changeCaseFunctions = [
  { name: caseTypes.upper,  func:upper },
  { name: caseTypes.lower, func:lower },
  { name: caseTypes.camel, func: cases.camelCase},
  { name: caseTypes.capital, func: cases.capitalCase},
  { name: caseTypes.constant, func: cases.constantCase},
  { name: caseTypes.dot, func: cases.dotCase},
  { name: caseTypes.header, func: cases.headerCase},
  { name: caseTypes.none, func:cases.noCase },
  { name: caseTypes.param, func:cases.paramCase },
  { name: caseTypes.pascal, func:cases.pascalCase},
  { name: caseTypes.sentence, func: cases.sentenceCase},
  { name: caseTypes.snake, func:cases.snakeCase},
];


function upper(text:string){
  return text.toUpperCase();
}

function lower(text:string){
  return text.toLowerCase();
}

export function changeTextCase(caseType: string) {
  console.log(`run case type ${caseType}`);
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const selection = editor.selection;

    const changeCaseFunction = changeCaseFunctions.filter(c => c.name === caseType)[0];
    if (!changeCaseFunction) {return;}

    if (selection.isSingleLine) {
      const selections = editor.selections;
      editor.edit(editBuilder => {
        selections.forEach(selection => {
          const selectedText = editor.document.getText(selection);
          const transformedText = changeCaseFunction.func(selectedText);
          editBuilder.replace(selection, transformedText );
        });
      });

    } else {
        editor.edit(editBuilder => {

          const range = new vscode.Range(selection.start, selection.end);

          for (let lineIndex = range.start.line; lineIndex <= range.end.line; lineIndex++) {
            const lineText = document.lineAt(lineIndex).text;
            const start = document.lineAt(lineIndex).range.start.character;
            const end = document.lineAt(lineIndex).range.end.character;
            const range = new vscode.Range(lineIndex, start, lineIndex, end);
            const transformedText = changeCaseFunction.func(lineText);

            editBuilder.replace(range, transformedText);
          }
        });
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  Object.entries(caseTypes).forEach(([key, value]) => {
    console.log(key, value);
    let commandId = `${extensionNamespace}.${value}`;
    let callback = function() { changeTextCase(value); };
    console.log(key, value);
    const disposable = vscode.commands.registerTextEditorCommand(commandId, callback);
    context.subscriptions.push(disposable);

  });
  console.log('Congratulations, your extension "case-changer" is now active!');
}


export function deactivate() {}
