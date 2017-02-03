var debug = true;

var $textarea = $('#log');

// Creates the Token Class to store token information 
class Token {
  constructor(tokenType, tokenValue, tokenLine) {
    this.type = tokenType;
    this.value = tokenValue;
    this.line = tokenLine;
  }
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.replaceAllRX = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

function isMatch(rx, str) {
    if (str.match(rx))
        return true;
    else
        return false;
}

function toggleDebug(){
	debug = !debug;
	
	if(!debug){
		$('#verboseToggle').html("Verbose: Off")
		$('#verboseToggle').toggleClass('btn btn-danger btn-lg');
		$('#verboseToggle').toggleClass('btn btn-default btn-lg');
	}
	else{
		$('#verboseToggle').html("Verbose: On")
		$('#verboseToggle').toggleClass('btn btn-default btn-lg');
		$('#verboseToggle').toggleClass('btn btn-danger btn-lg');
	}
}

function lex() {
    // Boolean for determining whether to print tokens of not (in case of Lex Failure)
    var printTokens = true;

    // Clears the log at the beginning of each Lex session
    $('#log').val("");
	var txt = $('#log').val("Beginning Lexing Session...\n\n");

    // Gets the code written inside the console textarea for processing
    var str = document.getElementById('console').value;

	if(debug)
		console.log(str);
	
    // Replaces breaklines with spaces and turns whole input into single lined string
    //str = str.replace(/(\r\n|\n|\r)/gm, " ");

    // ReGex pattern to break up input by symbols, keywords, etc.
	DELIMITER_PATTERN = /([a-z]+)|(\d+)|("[^"]*")|(==)|(!=)|(\S)|(\n)/g;
	
    //DELIMITER_PATTERN = /([a-z]+)|(\d+)|(")([^"]*)(")|(==)|(!=)|(\S)|(\n)/g; -- Old ReGex keeping incase of the need to Revert
	

    // Turns string into array delimited by the patter above
    str = str.split(DELIMITER_PATTERN);

    // Removes undefined elements within the array
    codeFrag = str.clean(undefined);
	
	for(var temp = 0; temp < codeFrag.length; temp++){
		codeFrag[temp] = codeFrag[temp].replace(/^ +| +$/gm, "");
	}
	
    // Logs the array that is going to be processed
    console.log(codeFrag);

    // Array to store tokens
    var tokens = [];
	
	// Array to store tokenStrings for display
	var tokenStrings = [];
	
	// Line Number
	var lineNum = 1;
	
	// Resets LEXER Error and Warning Count
	var lexErrorCount = 0;
	var lexWarningCount = 0;

    // Iterate through the condeFrag array to identify valid lexemes
    for (var i = 0; i < codeFrag.length; i++) {
		
		txt = $('#log').val();
		
		if(isMatch(/^\n+/, codeFrag[i])){
			if(debug)
				console.log("Break Line");
			lineNum++;
		}
		
        lexeme = codeFrag[i].trim();

        if (lexeme !== undefined) {
            // Regex for Print
            if (isMatch(/^print$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Print [print]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings.push("Print [ print ]");
				var token = new Token("PRINT", "print", lineNum);
				tokens.push(token);
            }
            // Regex for While 
            else if (isMatch(/^while$/, lexeme)) {
                if (debug){
					console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "While [while]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings.push("While [ while ]");
				var token = new Token("WHILE", "print", lineNum);
				tokens.push(token);
            }
            // Regex for If
            else if (isMatch(/^if$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "If [if]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings.push("If [ if ]");
				var token = new Token("IF", "if", lineNum);
				tokens.push(token);
            }
            // Regex for Variable Type
            else if (isMatch(/^int$|^string$|^boolean$/, lexeme)) {
                var type = lexeme.match(/^int$|^string$|^boolean$/);
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Variable Type [" + type[0] + "]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings.push("Variable Type [ " + type[0] + " ]");
				
				var temp = type[0].toUpperCase();
				var token = new Token("VT_" + temp, type[0], lineNum);
				
				tokens.push(token);
            }
            // Regex for Boolean Value
            else if (isMatch(/^true$|^false$/, lexeme)) {
                var boolVal = lexeme.match(/^true|false$/);
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Boolean Value [" + boolVal[0] + "]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings.push("Boolean Value [ " + boolVal[0] + " ]");
				
				var temp = boolVal[0].toUpperCase();
				var token = new Token("BV_" + temp, boolVal[0], lineNum);
				
				tokens.push(token);
            }
            // Regex for Left Brace
            else if (isMatch(/^{$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Left Brace [ { ]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings.push("Left Brace [ { ]");
				var token = new Token("LEFT_BRACE", "{", lineNum);
				tokens.push(token);
            }
            // Regex for Right Brace
            else if (isMatch(/^}$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Right Brace [ } ]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings.push("Right Brace [ } ]");
				var token = new Token("RIGHT_BRACE", "}", lineNum);
				tokens.push(token);
            }
            // Regex for Left Parenthesis
            else if (isMatch(/^\($/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Left Parenthesis [ ( ]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings.push("Left Parenthesis [ ( ]");
				var token = new Token("LEFT_PARENTHESIS", "(", lineNum);
				tokens.push(token);
            }
            // Regex for Right Parenthesis
            else if (isMatch(/^\)$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Right Parenthesis [ ) ]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings.push("Right Parenthesis [ ) ]");
				var token = new Token("RIGHT_PARENTHESIS", ")", lineNum);
				tokens.push(token);
            }
            // Regex for End of Program Symbol
            else if (isMatch(/^\$$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "End of Program Symbol [ $ ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings.push("End of Program Symbol [ $ ]");
				var token = new Token("EOPS", "$", lineNum);
				tokens.push(token);
            }
            // Regex for Equality Operator
            else if (isMatch(/^==$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Equality Operator [ == ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings.push("Equality Operator [ == ]");
				var token = new Token("EQUALITY_OP", "==", lineNum);
				tokens.push(token);
            }
            // Regex for Inequality Operator
            else if (isMatch(/^!=$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Inequality Operator [ != ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings.push("Inequality Operator [ != ]");
				var token = new Token("INEQUALITY_OP", "!=", lineNum);
				tokens.push(token);
            }
            // Regex for Assignment Operator
            else if (isMatch(/^=$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Assignment Operator [ = ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings.push("Assignment Operator [ = ]");
				var token = new Token("ASSIGNMENT_OP", "=", lineNum);
				tokens.push(token);
            }
            // Regex for Addition Operator
            else if (isMatch(/^\+$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Addition Operator [ + ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings.push("Addition Operator [ + ]");
				var token = new Token("ADDITION_OP", "+", lineNum);
				tokens.push(token);
            }
            // Regex for Identifiers
            else if (isMatch(/^[a-z]$/, lexeme)) {
                var iden = lexeme.match(/^[a-z]$/);
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Identifier [ " + iden[0] + " ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings.push("Identifier [ " + iden[0] + " ]");
				var token = new Token("ID", iden[0], lineNum);
				tokens.push(token);
            }
            // Regex for Digits
            else if (isMatch(/^[0-9]$/, lexeme)) {
                var digit = lexeme.match(/^[0-9]$/);
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Digit [ " + digit[0] + " ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings.push("Digit [ " + digit[0] + " ]");
				var token = new Token("DIGIT", digit[0], lineNum);
				tokens.push(token);
            }
            // Regex for Quotation
            else if (isMatch(/^"$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + "Quotation [ \" ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings.push("Quotation [ \" ]");
				var token = new Token("QUOTE", "\"", lineNum);
				tokens.push(token);
            }
            // Regex for String
            else if (isMatch(/^(")([a-z\s]*)(")$/, lexeme)) {
                var string = lexeme.match(/^(")([a-z\s]*)(")$/);
                if (debug){
					
					console.log(lexeme + " on line " + lineNum);
                    console.log(lexeme + " on line " + lineNum);
					console.log(lexeme + " on line " + lineNum);
					
					$('#log').val(txt + " LEXER --> | " + "Quotation [ \" ]" + " on line " + lineNum + "...\n");
					txt = $('#log').val();
					$('#log').val(txt + " LEXER --> | " + "String [ " + string[2] + " ]" + " on line " + lineNum + "...\n");
					txt = $('#log').val();
					$('#log').val(txt + " LEXER --> | " + "Quotation [ \" ]" + " on line " + lineNum + "...\n");
				}
				tokenStrings.push("Quotation [ \" ]");
                tokenStrings.push("String [ " + string[2] + " ]");
				tokenStrings.push("Quotation [ \" ]");
				
				var token = new Token("QUOTE", "\"", lineNum);
				var token2 = new Token("STRING", string[2], lineNum);
				var token3 = new Token("QUOTE", "\"", lineNum);
				
				tokens.push(token);
				tokens.push(token2);
				tokens.push(token3);
            }
            // Regex for White Space
            else if (lexeme === "") {
                if (debug)
                    console.log(lexeme + " on line " + lineNum);
            }
            // Breaks out of loop incase of invalid lexeme, logs which chracter caused the error to be thrown
            else {
				$('#log').val(txt + " LEXER --> | ERROR! Unrecognized or Invalid Token " + "[ " + lexeme + " ] on line " + lineNum + "\n");
                document.getElementById('marquee-holder').innerHTML = "";
                document.getElementById('tokenTable').innerHTML = "<th>No Tokens</th>";
				lexErrorCount++;
                printTokens = false;
				$textarea.scrollTop($textarea[0].scrollHeight);
                break;
            }
			
        }
		
		$textarea.scrollTop($textarea[0].scrollHeight);
    }

    // Clean the tokenStrings array of undefined variables again 
    tokenStrings = tokenStrings.clean(undefined);
	tokens = tokens.clean(undefined);
	
	if(tokens[tokens.length - 1].value != "$"){
		txt = $('#log').val();
		
		var endToken = new Token("EOPS", "$", tokens[tokens.length - 1].line);
		tokens.push(endToken);
		
		tokenStrings.push("End of Program Symbol [ $ ]");
		
		lexWarningCount++;
		if(debug) {
			$('#log').val(txt + " LEXER --> | WARNING! NO EOPS detected. Added to end-of-file at line " + lineNum + "...\n");
			$textarea.scrollTop($textarea[0].scrollHeight);
		}
	}
	
	console.log($('#log').val());
	
    // Logs the array of tokenStrings
    console.log(tokenStrings);
	
	// Logs token Array
	console.log(tokens);

    if (printTokens) {
		txt = $('#log').val();
		
		$('#log').val(txt + "\nLex Completed With " + lexWarningCount + " WARNING and " + lexErrorCount + " ERRORS" + "...");
		
		console.log($('#log').val());
		
		$textarea.scrollTop($textarea[0].scrollHeight);

        marqueeTokens = [];
        tableTokens = [];

        var tokenNumber = 0;

        // Prepares tokenStrings for printing into marquee and table
        for (var m = 0; m < tokens.length; m++) {
            marqueeTokens[m] = "<span class=\"tokenStream\">" + "<span class=\"tokenStreamNum\">" + tokenNumber + "</span> " + ":: " + "<span class=\"tokenStreamText\">" + tokenStrings[m] + "</span></span>";
            tableTokens[m] = "<tr class=\"tokenRow\"><td>" + tokenNumber + "</td><td>" + tokens[m].type + "</td><td>" + tokens[m].value + "</td><td>" + tokens[m].line + "</td></tr>";
            tokenNumber++;
        }

        // Prints tokenStrings into marquee and table
        document.getElementById('marquee-holder').innerHTML = "<marquee id='token-banner' behavior='scroll' direction='left' onmouseover='this.stop();' onmouseout='this.start();'>" + marqueeTokens.join("") + "</marquee>";
        document.getElementById('tokenTable').innerHTML = "<th>Token Number</th><th>Token Type</th><th>Value</th><th>Line Number</th>" + tableTokens.join("");
    }
	
	else{
		txt = $('#log').val();
		
		$('#log').val(txt + "\nLex Failed With " + lexWarningCount + " WARNING and " + lexErrorCount + " ERRORS" + "...");
	}
	
	return tokens;
}