import * as vscode from 'vscode';
import { EOL } from 'os';
import { transformCase, caseTypes } from './transformCase';
import { Console } from 'console';


const extensionNamespace = 'extension.changeCase';

async function changeTextCase(caseType: string) {
  console.log(`run case type ${caseType}`);
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const selection = editor.selection;
    const selections = editor.selections;


    if (selection.isSingleLine || selections.length > 1) {
      editor.edit(editBuilder => {
        selections.forEach(selection => {
          const selectedText = editor.document.getText(selection);
          const transformedText = transformCase(selectedText, caseType);
          editBuilder.replace(selection, transformedText);
        });
      });

    } else {
      editor.edit(editBuilder => {
          const range = new vscode.Range(selection.start, selection.end);

          for (let lineIndex = range.start.line; lineIndex <= range.end.line; lineIndex++) {
            let lineStart = lineIndex === range.start.line ? range.start.character: document.lineAt(lineIndex).range.start.character;
            let lineEnd = lineIndex === range.end.line ? range.end.character : document.lineAt(lineIndex).range.end.character;

            console.log(`lineStart:${lineStart} `);
            console.log(`lineEnd: ${lineEnd}`);

            const lineRange = new vscode.Range(lineIndex, lineStart, lineIndex, lineEnd);
            const lineText = document.getText(lineRange);
            const transformedText = transformCase(lineText, caseType);

            console.log(`linetext:${lineText}`);

            editBuilder.replace(lineRange, transformedText);
          }
      });
    }
  }
}

export async function activate(context: vscode.ExtensionContext) {
 
  Object.entries(caseTypes).forEach(([key, value]) => {
    console.log(key, value);
    let commandId = `${extensionNamespace}.${value}`;
    let callback = function() { changeTextCase(value as string); };
  
    console.log(key, value);
    const disposable = vscode.commands.registerTextEditorCommand(commandId, callback);
    context.subscriptions.push(disposable);
  
  });
  console.log('Congratulations, your extension "case-changer" is now active!');
}


export function deactivate() {}
