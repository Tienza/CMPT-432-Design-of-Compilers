var verbose = true;

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

function toggleVerbose(){
	verbose = !verbose;
	
	if(!verbose){
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

	if(verbose)
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
	
	// Line Number
	var lineNum = 1;
	
	// Resets LEXER Error and Warning Count
	var lexErrorCount = 0;
	var lexWarningCount = 0;

    // Iterate through the condeFrag array to identify valid lexemes
    for (var i = 0; i < codeFrag.length; i++) {
		
		txt = $('#log').val();
		
		if(isMatch(/^\n+/, codeFrag[i])){
			if(verbose)
				console.log("Break Line");
			lineNum++;
		}
		
        lexeme = codeFrag[i].trim();

        if (lexeme !== undefined) {
            // Regex for Print
            if (isMatch(/^print$/, lexeme)) {
				var token = new Token("T_PRINT", "print", lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n"); 
				}

				tokens.push(token);
            }
            // Regex for While 
            else if (isMatch(/^while$/, lexeme)) {
				var token = new Token("T_WHILE", "while", lineNum);
				
                if (verbose){
					console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n"); 
				}

				tokens.push(token);
            }
            // Regex for If
            else if (isMatch(/^if$/, lexeme)) {
				var token = new Token("T_IF", "if", lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}

				tokens.push(token);
            }
            // Regex for Variable Type
            else if (isMatch(/^int$|^string$|^boolean$/, lexeme)) {
                var type = lexeme.match(/^int$|^string$|^boolean$/);
				
				var token = new Token("T_VARIABLE_TYPE", type[0], lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}
				
				tokens.push(token);
            }
            // Regex for Boolean Value
            else if (isMatch(/^true$|^false$/, lexeme)) {
                var boolVal = lexeme.match(/^true|false$/);
				
				var token = new Token("T_BOOLEAN_VALUE", boolVal[0], lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}
				
				tokens.push(token);
            }
            // Regex for Left Brace
            else if (isMatch(/^{$/, lexeme)) {
				var token = new Token("T_OPENING_BRACE", "{", lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}

				tokens.push(token);
            }
            // Regex for Right Brace
            else if (isMatch(/^}$/, lexeme)) {
				var token = new Token("T_CLOSING_BRACE", "}", lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}
				
				tokens.push(token);
            }
            // Regex for Left Parenthesis
            else if (isMatch(/^\($/, lexeme)) {
				var token = new Token("T_OPENING_PARENTHESIS", "(", lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}

				tokens.push(token);
            }
            // Regex for Right Parenthesis
            else if (isMatch(/^\)$/, lexeme)) {
				var token = new Token("T_RIGHT_PARENTHESIS", ")", lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}

				tokens.push(token);
            }
            // Regex for End of Program Symbol
            else if (isMatch(/^\$$/, lexeme)) {
				var token = new Token("T_EOPS", "$", lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}

				tokens.push(token);
            }
            // Regex for Equality Operator
            else if (isMatch(/^==$/, lexeme)) {
				var token = new Token("T_EQUALITY_OP", "==", lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}

				tokens.push(token);
            }
            // Regex for Inequality Operator
            else if (isMatch(/^!=$/, lexeme)) {
				var token = new Token("T_INEQUALITY_OP", "!=", lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}

				tokens.push(token);
            }
            // Regex for Assignment Operator
            else if (isMatch(/^=$/, lexeme)) {
				var token = new Token("T_ASSIGNMENT_OP", "=", lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}

				tokens.push(token);
            }
            // Regex for Addition Operator
            else if (isMatch(/^\+$/, lexeme)) {
				var token = new Token("T_ADDITION_OP", "+", lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}

				tokens.push(token);
            }
            // Regex for Identifiers
            else if (isMatch(/^[a-z]$/, lexeme)) {
                var iden = lexeme.match(/^[a-z]$/);
				
				var token = new Token("T_ID", iden[0], lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}

				tokens.push(token);
            }
            // Regex for Digits
            else if (isMatch(/^[0-9]$/, lexeme)) {
                var digit = lexeme.match(/^[0-9]$/);
				
				var token = new Token("T_DIGIT", digit[0], lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}

				tokens.push(token);
            }
            // Regex for Quotation
            else if (isMatch(/^"$/, lexeme)) {
				var token = new Token("T_QUOTE", "\"", lineNum);
				
                if (verbose){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
				}

				tokens.push(token);
            }
            // Regex for String
            else if (isMatch(/^(")([a-z\s]*)(")$/, lexeme)) {
                var string = lexeme.match(/^(")([a-z\s]*)(")$/);
				
				var token = new Token("T_QUOTE", "\"", lineNum);
				var token2 = new Token("T_STRING", string[2], lineNum);
				var token3 = new Token("T_QUOTE", "\"", lineNum);
				
                if (verbose){
					
					console.log(string[1] + " on line " + lineNum);
                    console.log(string[2] + " on line " + lineNum);
					console.log(string[3] + " on line " + lineNum);
					
					$('#log').val(txt + " LEXER --> | " + token.type + " [ " + token.value + " ] " + " on line " + token.line + "...\n");
					txt = $('#log').val();
					$('#log').val(txt + " LEXER --> | " + token2.type + " [ " + token2.value + " ] " + " on line " + token2.line + "...\n");
					txt = $('#log').val();
					$('#log').val(txt + " LEXER --> | " + token3.type + " [ " + token3.value + " ] " + " on line " + token3.line + "...\n");
				}
				
				tokens.push(token);
				tokens.push(token2);
				tokens.push(token3);
            }
            // Regex for White Space
            else if (lexeme === "") {
                if (verbose)
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

	tokens = tokens.clean(undefined);
	
	var checkReturn = checkEOPS(tokens, lexWarningCount);
	
	// Assigns the return values of checkEOPS
	tokens = checkReturn[0];
	lexWarningCount = checkReturn[1];
	
	var printLastReturn = printLastMessage(tokens, printTokens, lexWarningCount, lexErrorCount);
	
	// Assigns the return values of printLastMessage
	tokens = printLastReturn[0];
	lexWarningCount = printLastReturn[1];
	lexErrorCount = printLastReturn[2];
	
	// Logs token Array
	console.log(tokens);
	
	return tokens;
}

function checkEOPS(tokenArray, lexWarningCount) {
	// Checks to see whether the program ends with a EOPS ($) or not. If not then adds EOPS to the end of the token stream
	if(tokenArray[tokenArray.length - 1].value != "$"){
		var txt = $('#log').val();
		
		var endToken = new Token("EOPS", "$", tokenArray[tokenArray.length - 1].line);
		tokenArray.push(endToken);
		
		lexWarningCount++;
		if(verbose) {
			$('#log').val(txt + " LEXER --> | WARNING! NO EOPS [$] detected. Added to end-of-file at line " + tokenArray[tokenArray.length- 1 ].line + "...\n");
			$textarea.scrollTop($textarea[0].scrollHeight);
		}
	}
	
	return [tokenArray, lexWarningCount];
}

function printLastMessage(tokenArray, printTokens, lexWarningCount, lexErrorCount) {
	// Decides what to print for Final Lex Message
    if (printTokens) {
		txt = $('#log').val();
		
		$('#log').val(txt + "\nLex Completed With " + lexWarningCount + " WARNING and " + lexErrorCount + " ERRORS" + "...");
		
		//console.log($('#log').val());
		
		$textarea.scrollTop($textarea[0].scrollHeight);

        marqueeTokens = [];
        tableTokens = [];

        var tokenNumber = 0;

        // Prepares token for printing into marquee and table
        for (var m = 0; m < tokenArray.length; m++) {
		marqueeTokens[m] = "<span class=\"tokenStream\">" + "<span class=\"tokenStreamNum\">" + tokenNumber + "</span> " + ":: " + "<span class=\"tokenStreamText\">" + tokenArray[m].type + " [ " + tokenArray[m].value + " ] " + "</span></span>";
            tableTokens[m] = "<tr class=\"tokenRow\"><td>" + tokenNumber + "</td><td>" + tokenArray[m].type + "</td><td>" + tokenArray[m].value + "</td><td>" + tokenArray[m].line + "</td></tr>";
            tokenNumber++;
        }

        // Prints token into marquee and table
        document.getElementById('marquee-holder').innerHTML = "<marquee id='token-banner' behavior='scroll' direction='left' onmouseover='this.stop();' onmouseout='this.start();'>" + marqueeTokens.join("") + "</marquee>";
        document.getElementById('tokenTable').innerHTML = "<th>Token Number</th><th>Token Type</th><th>Value</th><th>Line Number</th>" + tableTokens.join("");
    }
	
	else{
		txt = $('#log').val();
		
		$('#log').val(txt + "\nLex Failed With " + lexWarningCount + " WARNING and " + lexErrorCount + " ERRORS" + "...");
	}
	
	return [tokenArray, lexWarningCount, lexErrorCount];
}