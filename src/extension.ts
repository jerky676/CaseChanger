import * as vscode from 'vscode';
import { EOL } from 'os';
import { transformCase, caseTypes } from './transformCase';

const extensionNamespace = 'extension.changeCase';


async function changeTextCase(caseType: string) {
  console.log(`run case type ${caseType}`);
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const selection = editor.selection;

    if (selection.isSingleLine) {
      const selections = editor.selections;
      const selectedText = editor.document.getText(selection);
      const transformedText = transformCase(selectedText, caseType);

      editor.edit(editBuilder => {
        selections.forEach(selection => {
          editBuilder.replace(selection, transformedText);
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
            const transformedText = transformCase(lineText, caseType);

          
            editBuilder.replace(range, transformedText);
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
