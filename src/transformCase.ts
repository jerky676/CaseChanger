import * as cases from "change-case";

export const caseTypes = {
    upper:'upper',
    lower:'lower',
    camel: 'camel',
    capital: 'capital',
    constant: 'constant',
    dot: 'dot',
    none:'none',
    kebab: 'kebab',
    pascal: 'pascal',
    sentence: 'sentence',
    snake: 'snake',
};
  
function upper(text:string){
    return text.toUpperCase();
}
  
function lower(text:string){
    return text.toLowerCase();
}


const changeCaseFunctions = [
    { name: caseTypes.upper,  func:upper },
    { name: caseTypes.lower, func:lower },
    { name: caseTypes.camel, func: cases.camelCase},
    { name: caseTypes.capital, func: cases.capitalCase},
    { name: caseTypes.constant, func: cases.constantCase},
    { name: caseTypes.dot, func: cases.dotCase},
    { name: caseTypes.kebab, func: cases.paramCase},
    { name: caseTypes.none, func:cases.noCase },
    { name: caseTypes.pascal, func:cases.pascalCase},
    { name: caseTypes.sentence, func: cases.sentenceCase},
    { name: caseTypes.snake, func:cases.snakeCase},
];
  

  
export function transformCase(selectedText:string, caseType:string){
    const changeCaseFunction = changeCaseFunctions.filter(c => c.name === caseType)[0];

    if (!changeCaseFunction) {
        throw new Error(`Case type ${caseType} not found`);
    }

    const leadingWhitespace = selectedText.match(/^[ \t]*/)?.[0] || '';
    const trailingWhitespace = selectedText.match(/[ \t]*$/)?.[0] || '';
    const convertedText = changeCaseFunction.func(selectedText.trim());
    
    return `${leadingWhitespace}${convertedText}${trailingWhitespace}`;
}