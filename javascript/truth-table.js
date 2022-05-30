var input = document.getElementById("inputExpression");
var button = document.getElementById("calculate");
const areaForTT = document.getElementById("area-for-TT");
var allVariables = new Map;
var postFix = new Array;
var convertedExpression, displayExpression, stringLen, result;

//To convert expression in standard form, get variable names and to check for errors in the expression.
function convertExpression(){
  allVariables.clear();
  displayExpression = "";
  convertedExpression = "";
  //Elements of convertedExpression:
  // 1. variables
  // 2. (
  // 3. )
  // 4. ! not
  // 5. & and
  // 6. | or
  // 7. = equivalence
  // 8. > implication

  let inputExpression = input.value;

  if(inputExpression.length == 0){
    return;
  }

  //The last element should only be a variable or ).
  let lastElement = inputExpression[inputExpression.length - 1];
  if(!((lastElement >= 'a' && lastElement <= 'z')||(lastElement >= 'A' && lastElement <= 'Z')||(lastElement == ')'))){
    return true;
  }

  let bracketsIndexStack = new Array();
  let previousElementInt = 2;
  // previousElementInt 1. Variable (Also T and F)
  //                    2. Operator (except !/~)
  //                    3. (        (also !/~ as they act similar to ( in terms of what will be the next element.)
  //                    4. )
  
  for (let i = 0; i < inputExpression.length; i++) {
    const element = inputExpression[i];
    
    
    if((element >= 'a' && element <= 'z')||(element >= 'A' && element <= 'Z')){

      //Error present.
      if(previousElementInt == 4){
        return true;
      }

      previousElementInt = 1;

      let variableStartIndex = i;

      //To get the variable name.
      for (; i < inputExpression.length; i++) {
        const newElement = inputExpression[i]
        
        if(!((newElement >= 'a' && newElement <= 'z')||(newElement >= 'A' && newElement <= 'Z'))){
          break;
        }
        
      }

      let variableName = inputExpression.substring(variableStartIndex, i);
      i--;

      //Check for T or F
      if(!(variableName == 'T' || variableName == 'F')){
        let variableNo = allVariables.get(variableName);
      
        if(variableNo == undefined){
          variableNo = 0;
        }
        
        allVariables.set(variableName, variableNo + 1);
      }

      convertedExpression += variableName;
      displayExpression += variableName;
    }
    else if(element === '('){
      if(previousElementInt == 1 || previousElementInt == 4){
        return true;
      }
      previousElementInt = 3;

      bracketsIndexStack.push(convertedExpression.length.toString());
      convertedExpression += '(';
      displayExpression += '(';
    }
    else if(element === ')'){
      if(previousElementInt == 2 || previousElementInt == 3){
        return true;
      }
      previousElementInt = 4;

      if(bracketsIndexStack.length == 0){
        return true;
      }

      bracketsIndexStack.pop()

      convertedExpression += ')';
      displayExpression += ')';
    }
    else if (element === '!' || element === '~') {
      //Not operator(!, ~)
      //Special case for operator as it has single operand.
      if(previousElementInt == 1 || previousElementInt == 4){
        return true;
      }
      previousElementInt = 3;

      convertedExpression += '!';
      displayExpression += " ~";
    }
    else{
      //Element is operator
      if(previousElementInt == 2 || previousElementInt == 3){
        return true;
      }
      previousElementInt = 2;

      if(element === '&' || element === '^'){
        //And operator(&, &&, ^)

        if(element == '&' && inputExpression[i+1] == '&'){
          i++;
        }

        convertedExpression += '&';
        displayExpression += " ∧ "
      }
      else if(element === '|'){
        //Or operator(|, ||)

        if(element == '|' && inputExpression[i+1] == '|'){
          i++;
        }

        convertedExpression += '|';
        displayExpression += " ∨ ";
      }
      else if(element === '<'){
        //Equivalence operator(double implication)(<->, <=>)

        if((inputExpression[i+1] == '-' || inputExpression[i+1] == '=') && inputExpression[i+2] == '>'){
          i += 2;
        }
        else{
          return true;
        }

        convertedExpression += '=';
        displayExpression += " ⇔ "
      }
      else if(element === '=' || element === '-'){
        //Implication operator(->, =>)

        if(inputExpression[i+1] == '>'){
          i += 1;
        }
        else{
          return true;
        }

        convertedExpression += '>';
        displayExpression += " → "
      }
      else{
        //Element is an invalid character
        return true;
      }
    }
    
  }

  if(bracketsIndexStack.length != 0){
    return true;
  }

}

//To assign 2^n values to variables in form of string of 0 and 1. n is num of variables.
function assignValuesToVar(){
  let numOfVars = allVariables.size;
  stringLen = Math.pow(2, numOfVars);
  let n = stringLen;
  let varPosition = 0;
  
  allVariables.forEach((value, key) => {
    let valsString = "";

    for (let i = 0; i < n/2; i++) {
      valsString += '0';   
    }

    for (let i = n/2; i < n; i++) {
      valsString += '1';   
    }

    for (let i = 0; i < varPosition; i++) {
      valsString += valsString;
    }

    varPosition++;
    n  = n/2;

    allVariables.set(key, valsString);
  })

  let stringT = "";
  let stringF = "";

  for (let i = 0; i < stringLen; i++) {
    stringT += '1';
    stringF += '0';
  }

  allVariables.set("T", stringT);
  allVariables.set("F", stringF);
}

// Created an empty array
var stackarr = [];
 
// Variable topp initialized with -1
var topp = -1;
 
// Push function for pushing
// elements inside stack
function push(e) {
    topp++;
    stackarr[topp] = e;
}
 
// Pop function for returning top element
function pop() {
    if (topp == -1)
        return 0;
    else {
        var popped_ele = stackarr[topp];
        topp--;
        return popped_ele;
    }
}
 
// Function to check whether the passed
// character is operator or not
function isOperator(op) {
  if (op == '&' || op == '|' ||
      op == '!' || op == '=' ||
      op == '>' || op == '(' ||
      op == ')') {
      return true;
  }
  else
      return false;
}
 
// Function to return the precedency of operator
function precedency(pre) {
  if (pre == '@' || pre == '(' || pre == ')') {
    return 1;
  }
  else if (pre == '=') {
    return 2;
  }
  else if (pre == '>') {
    return 3;
  }
  else if (pre == '|') {
    return 4;
  }
  else if (pre == '&') {
    return 5;
  }
  else if (pre == '!') {
    return 6;
  }
  else
    return 0;
}
 
// Function to convert Infix to Postfix
function infixtoPostfix() {

  // Postfix array made empty
  postFix = [];
  let temp = 0;
  push('@');
  let infixval = convertedExpression;

  // Iterate on infix string
  for (let i = 0; i < infixval.length; i++) {
    let el = infixval[i];

    // Checking whether operator or not
    if (isOperator(el)) {
      if (el == ')') {
        while (stackarr[topp] != "(") {
          postFix[temp++] = pop();
        }
        pop();
      }

      // Checking whether el is (  or not
      else if (el == '(') {
        push(el);
      }

      // Comparing precedency of el and
      // stackarr[topp]
      else if (precedency(el) >= precedency(stackarr[topp])) {
        push(el);
      }
      else {
        while (precedency(el) < precedency(stackarr[topp]) && topp > -1) {
          postFix[temp++] = pop();
        }
        push(el);
      }
    }
    else {
      let variableStartIndex = i;

      //To get the variable name.
      for (; i < infixval.length; i++) {
        const newElement = infixval[i];
        
        if(!((newElement >= 'a' && newElement <= 'z')||(newElement >= 'A' && newElement <= 'Z'))){
          break;
        }
        
      }

      let variableName = infixval.substring(variableStartIndex, i);
      i--;
      postFix[temp++] = variableName;
    }
  }

  // Adding character until stackarr[topp] is @
  while (stackarr[topp] != '@') {
    postFix[temp++] = pop();
  }

}

function and(a, b){
  let ans = "";

  for (let i = 0; i < stringLen; i++) {
    let intAns = parseInt(a[i])&&parseInt(b[i]);
    ans += intAns.toString();
  }
  return ans;
}

function or(a, b){
  let ans = "";

  for (let i = 0; i < stringLen; i++) {
    let intAns = parseInt(a[i])||parseInt(b[i]);
    ans += intAns.toString();
  }
  return ans;
}

function implies(a, b){
  let ans = "";

  for (let i = 0; i < stringLen; i++) {
    let intAns = (+ !parseInt(a[i]))||parseInt(b[i]);//unary + to convert true, false to 1, 0.
    ans += intAns.toString();
  }
  return ans;
}

function doubleImplies(a, b){
  let ans = "";

  for (let i = 0; i < stringLen; i++) {
    let intAns =  + (parseInt(a[i]) == parseInt(b[i]));//unary + to convert true, false to 1, 0.
    ans += intAns.toString();
  }
  return ans;
}

function not(a){
  let ans = "";

  for (let i = 0; i < stringLen; i++) {
    let intAns = + !parseInt(a[i]);//unary + to convert true, false to 1, 0.
    ans += intAns.toString();
  }
  return ans;
}

function solvePostfix(){
  let operandsStack = new Array();

  postFix.forEach((value) => {
    if (value === '=') {
      let operand2 = operandsStack.pop()
      let smallResult = doubleImplies(operandsStack.pop(), operand2);
      operandsStack.push(smallResult);
    }
    else if (value === '>') {
      let operand2 = operandsStack.pop()
      let smallResult = implies(operandsStack.pop(), operand2);
      operandsStack.push(smallResult);
    }
    else if (value === '|') {
      let smallResult = or(operandsStack.pop(), operandsStack.pop());
      operandsStack.push(smallResult);
    }
    else if (value === '&') {
      let smallResult = and(operandsStack.pop(), operandsStack.pop());
      operandsStack.push(smallResult);
    }
    else if (value === '!') {
      let smallResult = not(operandsStack.pop());
      operandsStack.push(smallResult);
    }
    else{
      operandsStack.push(allVariables.get(value));
    }
  })

  result =  operandsStack[0];
}

//To actually display the truth table in html.
function displayTT(){
  allVariables.delete("T");
  allVariables.delete("F");
  
  let innerHTMLText = "<Table>";
  innerHTMLText += "<tr>"

  allVariables.forEach((value, key) => {
    innerHTMLText += "<th>" + key + "</th>";
  })

  innerHTMLText += "<th>" + displayExpression + "</th>";

  innerHTMLText += "</tr>"

  for (let index = 0; index < stringLen; index++) {
    let currClass = "odd";

    if (index%2 == 0) {
      currClass = "even";
    }

    innerHTMLText += "<tr class='" + currClass + "'>";

    allVariables.forEach((value) => {
      innerHTMLText += "<td>" + (value[index] === '0' ? 'F' : 'T') + "</td>";
    })

    innerHTMLText += "<td>" + (result[index] === '0' ? 'F' : 'T') + "</td>";

    innerHTMLText += "</tr>";
  }



  innerHTMLText += "</table>";


  areaForTT.innerHTML = innerHTMLText;
}

//To calculate TT when pressed enter of when clicked calculate button.
function calculate(){
  let errorPresent = convertExpression();
  if(errorPresent){
    areaForTT.innerHTML = "<h3>Enter A Valid Expression!!!</h3>";
    return;
  }

  assignValuesToVar();

  infixtoPostfix();

  solvePostfix();

  displayTT()
}

//To calculate when pressed enter in input.
input.addEventListener("keyup", function(event) {
  if (event.key === 'Enter') {
    document.getElementById("calculate").click();
  }
});