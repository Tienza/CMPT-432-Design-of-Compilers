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
    DELIMITER_PATTERN = /([a-z]+)|(\d+)|(")([^"]*)(")|(==)|(!=)|(\S)|(\n)/g;

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
					$('#log').val(txt + " | " + "Print [print]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings[i] = "Print [ print ]";
				var token = new Token("PRINT", "print", lineNum);
				tokens[i] = token;
            }
            // Regex for While 
            else if (isMatch(/^while$/, lexeme)) {
                if (debug){
					console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "While [while]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings[i] = "While [ while ]";
				var token = new Token("WHILE", "print", lineNum);
				tokens[i] = token;
            }
            // Regex for If
            else if (isMatch(/^if$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "If [if]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings[i] = "If [ if ]";
				var token = new Token("IF", "if", lineNum);
				tokens[i] = token;
            }
            // Regex for Variable Type
            else if (isMatch(/^int$|^string$|^boolean$/, lexeme)) {
                var type = lexeme.match(/^int$|^string$|^boolean$/);
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Variable Type [" + type[0] + "]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings[i] = "Variable Type [ " + type[0] + " ]";
				var temp = type[0].toUpperCase();
				var token = new Token("VT_" + temp, type[0], lineNum);
				tokens[i] = token;
            }
            // Regex for Boolean Value
            else if (isMatch(/^true$|^false$/, lexeme)) {
                var boolVal = lexeme.match(/^true|false$/);
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Boolean Value [" + boolVal[0] + "]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings[i] = "Boolean Value [ " + boolVal[0] + " ]";
				var temp = boolVal[0].toUpperCase();
				var token = new Token("BV_" + temp, boolVal[0], lineNum);
				tokens[i] = token;
            }
            // Regex for Left Brace
            else if (isMatch(/^{$/, lexeme) && codeFrag[i - 1] != "\"" && codeFrag[i + 1] != "\"") {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Left Brace [ { ]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings[i] = "Left Brace [ { ]";
				var token = new Token("LEFT_BRACE", "{", lineNum);
				tokens[i] = token;
            }
            // Regex for Right Brace
            else if (isMatch(/^}$/, lexeme) && codeFrag[i - 1] != "\"" && codeFrag[i + 1] != "\"") {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Right Brace [ } ]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings[i] = "Right Brace [ } ]";
				var token = new Token("RIGHT_BRACE", "}", lineNum);
				tokens[i] = token;
            }
            // Regex for Left Parenthesis
            else if (isMatch(/^\($/, lexeme) && codeFrag[i - 1] != "\"" && codeFrag[i + 1] != "\"") {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Left Parenthesis [ ( ]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings[i] = "Left Parenthesis [ ( ]";
				var token = new Token("LEFT_PARENTHESIS", "(", lineNum);
				tokens[i] = token;
            }
            // Regex for Right Parenthesis
            else if (isMatch(/^\)$/, lexeme) && codeFrag[i - 1] != "\"" && codeFrag[i + 1] != "\"") {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Right Parenthesis [ ) ]" + " on line " + lineNum + "...\n"); 
				}
                tokenStrings[i] = "Right Parenthesis [ ) ]";
				var token = new Token("RIGHT_PARENTHESIS", ")", lineNum);
				tokens[i] = token;
            }
            // Regex for End of Program Symbol
            else if (isMatch(/^\$$/, lexeme) && codeFrag[i - 1] != "\"" && codeFrag[i + 1] != "\"") {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "End of Program Symbol [ $ ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings[i] = "End of Program Symbol [ $ ]";
				var token = new Token("EOPS", "$", lineNum);
				tokens[i] = token;
            }
            // Regex for Equality Operator
            else if (isMatch(/^==$/, lexeme) && codeFrag[i - 1] != "\"" && codeFrag[i + 1] != "\"") {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Equality Operator [ == ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings[i] = "Equality Operator [ == ]";
				var token = new Token("EQUALITY_OP", "==", lineNum);
				tokens[i] = token;
            }
            // Regex for Inequality Operator
            else if (isMatch(/^!=$/, lexeme) && codeFrag[i - 1] != "\"" && codeFrag[i + 1] != "\"") {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Inequality Operator [ != ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings[i] = "Inequality Operator [ != ]";
				var token = new Token("INEQUALITY_OP", "!=", lineNum);
				tokens[i] = token;
            }
            // Regex for Assignment Operator
            else if (isMatch(/^=$/, lexeme) && codeFrag[i - 1] != "\"" && codeFrag[i + 1] != "\"") {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Assignment Operator [ = ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings[i] = "Assignment Operator [ = ]";
				var token = new Token("ASSIGNMENT_OP", "=", lineNum);
				tokens[i] = token;
            }
            // Regex for Addition Operator
            else if (isMatch(/^\+$/, lexeme) && codeFrag[i - 1] != "\"" && codeFrag[i + 1] != "\"") {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Addition Operator [ + ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings[i] = "Addition Operator [ + ]";
				var token = new Token("ADDITION_OP", "+", lineNum);
				tokens[i] = token;
            }
            // Regex for Identifiers
            else if (isMatch(/^[a-z]$/, lexeme) && codeFrag[i - 1] != "\"" && codeFrag[i + 1] != "\"") {
                var iden = lexeme.match(/^[a-z]$/);
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Identifier [ " + iden[0] + " ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings[i] = "Identifier [ " + iden[0] + " ]";
				var token = new Token("ID", iden[0], lineNum);
				tokens[i] = token;
            }
            // Regex for Digits
            else if (isMatch(/^[0-9]$/, lexeme) && codeFrag[i - 1] != "\"" && codeFrag[i + 1] != "\"") {
                var digit = lexeme.match(/^[0-9]$/);
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Digit [ " + digit[0] + " ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings[i] = "Digit [ " + digit[0] + " ]";
				var token = new Token("DIGIT", digit[0], lineNum);
				tokens[i] = token;
            }
            // Regex for Quotation
            else if (isMatch(/^"$/, lexeme)) {
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "Quotation [ \" ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings[i] = "Quotation [ \" ]";
				var token = new Token("QUOTE", "\"", lineNum);
				tokens[i] = token;
            }
            // Regex for String
            else if (isMatch(/^[a-z\s]*$/, lexeme) && codeFrag[i - 1] == "\"" && codeFrag[i + 1] == "\"") {
                var string = lexeme.match(/^[a-z\s]*$/);
                if (debug){
                    console.log(lexeme + " on line " + lineNum);
					$('#log').val(txt + " | " + "String [ " + string[0] + " ]" + " on line " + lineNum + "...\n");
				}
                tokenStrings[i] = "String [ " + string[0] + " ]";
				var token = new Token("STRING", string[0], lineNum);
				tokens[i] = token;
            }
            // Regex for White Space
            else if (lexeme === "") {
                if (debug)
                    console.log(lexeme + " on line " + lineNum);
            }
            // Breaks out of loop incase of invalid lexeme, logs which chracter caused the error to be thrown
            else {
				$('#log').val(txt + "LEX ERROR - Unrecognized Character " + "[\"" + lexeme + "\"] on line " + lineNum + "\n");
                document.getElementById('marquee-holder').innerHTML = "";
                document.getElementById('tokenTable').innerHTML = "<th>No Tokens</th>";
                printTokens = false
                break;
            }
			
        }
		
		$textarea.scrollTop($textarea[0].scrollHeight);
    }

    // Clean the tokenStrings array of undefined variables again 
    tokenStrings = tokenStrings.clean(undefined);
	tokens = tokens.clean(undefined);

    // Logs the array of tokenStrings
    console.log(tokenStrings);
	
	// Logs token Array
	console.log(tokens);

    if (printTokens) {
		
		$('#log').val(txt + "\nLex Successful...");
		
		$textarea.scrollTop($textarea[0].scrollHeight);

        marqueeTokens = [];
        tableTokens = [];

        var tokenNumber = 1;

        // Prepares tokenStrings for printing into marquee and table
        for (var m = 0; m < tokenStrings.length; m++) {
            marqueeTokens[m] = "<span class=\"tokenStream\">" + "<span class=\"tokenStreamNum\">" + tokenNumber + "</span> " + ":: " + "<span class=\"tokenStreamText\">" + tokenStrings[m] + "</span></span>";
            tableTokens[m] = "<tr class=\"tokenRow\"><td>" + tokenNumber + " :: " + tokens[m].type + "</td><td>" + tokens[m].value + "</td></tr>";
            tokenNumber++;
        }

        // Prints tokenStrings into marquee and table
        document.getElementById('marquee-holder').innerHTML = "<marquee id='token-banner' behavior='scroll' direction='left' onmouseover='this.stop();' onmouseout='this.start();'>" + marqueeTokens.join("") + "</marquee>";
        document.getElementById('tokenTable').innerHTML = "<th>Token Type</th><th>Value</th>" + tableTokens.join("");
    }
	
	return tokens;
}