// Initialize the Lexing Process
function lex() {
    // Boolean for determining whether to print tokens or not (in case of Lex Failure)
    var printTokens = true;

    // Boolean for determing whether to run checkEOPS
    var reachedEnd = true;

    // Clears the log and resets page
    $('#log').val("");
    resetIndexPage();

    // Begin Lexing Statement - Changes depending on how we are handling Strings
    var txt = $('#log').val("Beginning Lexing Session... *Stings Treated As CharList*\n\n");
    txt = $('#log').val();

    // Gets the code written inside the console textarea for processing
    //var str = document.getElementById('console').value;
	var str = editor.getValue();

    // Resets and initialize LEXER Error and Warning Count
    var lexErrorCount = 0;
    var lexWarningCount = 0;

    // Array to store tokens
    var tokens = [];

    // Line Number
    var lineNum = 1;

    // Replaces breaklines with spaces and turns whole input into single lined string
    //str = str.replace(/(\r\n|\n|\r)/gm, " ");
    if (/\S/.test(str)) {
        // RegEx pattern to break up input by symbols, keywords, etc.
        // Must also give credit where it is due, this RegEx a modified form of the RegEx from Svegliator which is a modified
        // version of the RegEx from apparent RegEx god "Chris"
        DELIMITER_PATTERN = /([a-z]+)|(\d+)|("[^"]*")|(\/\*[^\/\*]*\*\/)|(==)|(!=)|(\S)|(\n)/g;

        // Turns string into array delimited by the pattern above
        str = str.split(DELIMITER_PATTERN);

        // Removes undefined elements within the array
        var codeFrag = str.clean(undefined);
        var codeFrag2 = [];

        for (var subBreak = 0; subBreak < codeFrag.length; subBreak++) {
            if (isMatch(/^([a-z][a-z]+)$/, codeFrag[subBreak]) && codeFrag[subBreak] != "print" && codeFrag[subBreak] != "while" && codeFrag[subBreak] != "if" && codeFrag[subBreak] != "int" && codeFrag[subBreak] != "string" && codeFrag[subBreak] != "boolean" && codeFrag[subBreak] != "false" && codeFrag[subBreak] != "true") {
                codeFrag[subBreak] = tokenBeautify(codeFrag[subBreak]);
                codeFrag[subBreak] = codeFrag[subBreak].split(DELIMITER_PATTERN);
                codeFrag[subBreak] = codeFrag[subBreak].clean(undefined);
            }
        }

        codeFrag = [].concat.apply([], codeFrag);

        for (var temp = 0; temp < codeFrag.length; temp++) {
            if (isMatch(/^([a-z][a-z]+)$/, codeFrag[temp]) && codeFrag[temp] != "print" && codeFrag[temp] != "while" && codeFrag[temp] != "if" && codeFrag[temp] != "int" && codeFrag[temp] != "string" && codeFrag[temp] != "boolean" && codeFrag[temp] != "false" && codeFrag[temp] != "true") {
                var tempArray = codeFrag[temp].split("");
                for (var repeatChar = 0; repeatChar < tempArray.length; repeatChar++) {
                    codeFrag2.push(tempArray[repeatChar]);
                }
            } else {
                codeFrag[temp] = codeFrag[temp].replace(/^ +| +$/gm, "");
                codeFrag2.push(codeFrag[temp]);
            }
        }

		codeFrag = codeFrag2;
		
        // Iterate through the condeFrag array to identify valid lexemes
        for (var i = 0; i < codeFrag.length; i++) {
            if (isMatch(/^\n+/, codeFrag[i]))
                lineNum++;

            lexeme = codeFrag[i].trim();

            if (lexeme !== undefined) {
                // RegEx for Print
                if (isMatch(/^print$/, lexeme)) {
                    var token = new Token("T_PRINT", "print", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for While 
                else if (isMatch(/^while$/, lexeme)) {
                    var token = new Token("T_WHILE", "while", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for If
                else if (isMatch(/^if$/, lexeme)) {
                    var token = new Token("T_IF", "if", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Variable Type
                else if (isMatch(/^int$|^string$|^boolean$/, lexeme)) {
                    var type = lexeme.match(/^int$|^string$|^boolean$/);

                    var token = new Token("T_VARIABLE_TYPE", type[0], lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Boolean Value
                else if (isMatch(/^true$|^false$/, lexeme)) {
                    var boolVal = lexeme.match(/^true|false$/);

                    var token = new Token("T_BOOLEAN_VALUE", boolVal[0], lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Left Brace
                else if (isMatch(/^{$/, lexeme)) {
                    var token = new Token("T_OPENING_BRACE", "{", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Right Brace
                else if (isMatch(/^}$/, lexeme)) {
                    var token = new Token("T_CLOSING_BRACE", "}", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Left Parenthesis
                else if (isMatch(/^\($/, lexeme)) {
                    var token = new Token("T_OPENING_PARENTHESIS", "(", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Right Parenthesis
                else if (isMatch(/^\)$/, lexeme)) {
                    var token = new Token("T_CLOSING_PARENTHESIS", ")", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for End of Program Symbol
                else if (isMatch(/^\$$/, lexeme)) {
                    var token = new Token("T_EOPS", "$", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Equality Operator
                else if (isMatch(/^==$/, lexeme)) {
                    var token = new Token("T_EQUALITY_OP", "==", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Inequality Operator
                else if (isMatch(/^!=$/, lexeme)) {
                    var token = new Token("T_INEQUALITY_OP", "!=", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Assignment Operator
                else if (isMatch(/^=$/, lexeme)) {
                    var token = new Token("T_ASSIGNMENT_OP", "=", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Addition Operator
                else if (isMatch(/^\+$/, lexeme)) {
                    var token = new Token("T_ADDITION_OP", "+", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Identifiers
                else if (isMatch(/^[a-z]$/, lexeme)) {
                    var iden = lexeme.match(/^[a-z]$/);

                    var token = new Token("T_ID", iden[0], lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Digits
                else if (isMatch(/^[0-9]$/, lexeme)) {
                    var digit = lexeme.match(/^[0-9]$/);

                    var token = new Token("T_DIGIT", digit[0], lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for Quotation
                else if (isMatch(/^"$/, lexeme)) {
                    var token = new Token("T_QUOTE", "\"", lineNum);

                    if (verbose) {
                        txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                    }

                    tokens.push(token);
                }
                // RegEx for String -- Either by String Blocks or CharLists ---
                else if (isMatch(/^(")([a-z \t]*)(")$/, lexeme)) {
                    // Creates Token for full string
                    if (!byChar) {
                        var string = lexeme.match(/^(")([a-z \t]*)(")$/);

                        var token = new Token("T_QUOTE", "\"", lineNum);
                        var token2 = new Token("T_STRING", string[2], lineNum);
                        var token3 = new Token("T_QUOTE", "\"", lineNum);

                        if (verbose) {

                            // console.log(string[1] + " on line " + lineNum);
                            // console.log(string[2] + " on line " + lineNum);
                            // console.log(string[3] + " on line " + lineNum);

                            txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                            //txt = $('#log').val();
                            txt = txt + " LEXER --> | " + token2.kind + " [ " + token2.value + " ] " + " on line " + token2.line + "...\n";
                            //txt = $('#log').val();
                            txt = txt + " LEXER --> | " + token3.kind + " [ " + token3.value + " ] " + " on line " + token3.line + "...\n";
                        }

                        tokens.push(token);
                        tokens.push(token2);
                        tokens.push(token3);
                    }
                    // Creates Token for each Char
                    else {
                        // Split input into individual characters
                        lexeme = lexeme.split("");
                        // Runs though each characters attempting to classify and generate appropriate tokens. 
                        // Patterns are the same as above, with the exception of of T_WHITE_SPACE, which only exists here
                        for (var lexElem = 0; lexElem < lexeme.length; lexElem++) {

                            //txt = $('#log').val();

                            var lexChar = lexeme[lexElem];

                            if (isMatch(/^"$/, lexChar)) {
                                var token = new Token("T_QUOTE", "\"", lineNum);

                                if (verbose) {
                                    // console.log(lexChar + " on line " + lineNum);
                                    txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                                }

                                tokens.push(token);
                            } else if (isMatch(/^[a-z]$/, lexChar)) {
                                var token = new Token("T_CHAR", lexChar, lineNum);

                                if (verbose) {
                                    // console.log(lexChar + " on line " + lineNum);
                                    txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                                }

                                tokens.push(token);
                            }
                            // Creates a Token for white spaces only if they exist inside a string
                            else if (isMatch(/^\s$/, lexChar)) {
                                var token = new Token("T_CHAR", lexChar, lineNum);

                                if (verbose) {
                                    // console.log(lexChar + " on line " + lineNum);
                                    txt = txt + " LEXER --> | " + token.kind + " [ " + token.value + " ] " + " on line " + token.line + "...\n";
                                }

                                tokens.push(token);
                            } 
							// No more valid actions break out of loop
							else {
                                if (verbose)
                                    console.log("Broke out of string loop...")
                                break;
                            }
                        }
                    }
                }
                // RegEx for White Space
                else if (lexeme === "") {
                    /*if (verbose)
                        console.log(lexeme + " on line " + lineNum);*/
                }
				// RegEx for Multi-line Comments: Updates lineNum with number of break lines in comment
				else if (isMatch(/^(\/\*[^\/\*]*\*\/)$/, lexeme)) {
					lineNum = lineNum + lexeme.replace(/[^\n]/g, "").length;
				}
                // Breaks out of loop incase of invalid lexeme, logs which chracter caused the error to be thrown
                else {
                    $('#log').val(txt + " LEXER --> | ERROR! Unrecognized or Invalid Token " + "[ " + lexeme + " ] on line " + lineNum + "\n");
                    document.getElementById('marquee-holder').innerHTML = "";
                    document.getElementById('tokenTable').innerHTML = "<th>No Tokens</th>";
                    lexErrorCount++;
                    printTokens = false;
                    reachedEnd = false;
                    scrollDown();
                    break;
                }

            }
        }

        tokens = tokens.clean(undefined);

        var checkReturn = checkEOPS(tokens, reachedEnd, lexWarningCount, lexErrorCount);

        // Assigns the return values of checkEOPS
        tokens = checkReturn.tokenArray;
        lexWarningCount = checkReturn.lexWarningCount;
        lexErrorCount = checkReturn.lexErrorCount;

        var printLastReturn = printLastMessage(tokens, printTokens, lexWarningCount, lexErrorCount);

        // Assigns the return values of printLastMessage
        tokens = printLastReturn.tokenArray;
        lexWarningCount = printLastReturn.lexWarningCount;
        lexErrorCount = printLastReturn.lexErrorCount;

        // Logs token Array
        /*console.log(tokens);*/

        // Variable to store all objects moving on to the parser
        var lexReturns = {
            tokenArray: tokens,
			astLexemes: codeFrag,
            warningCount: lexWarningCount,
            errorCount: lexErrorCount
        }

        // Break Teeth
        if (lexComplete)
            brokenTeeth(3);

        return lexReturns;
    }
    // If console is empty and the user tries to lex then return an error
    else {
        printTokens = false;

        lexErrorCount++;

        txt = $('#log').val();

        $('#log').val(txt + " LEXER --> | ERROR! Empty Input or Only White-Space Detected...\n");

        printLastMessage(tokens, printTokens, lexWarningCount, lexErrorCount);
    }

    function checkEOPS(tokenArray, reachedEnd, lexWarningCount, lexErrorCount) {
        //var txt = $('#log').val();

        var checkEOPS = {
            tokenArray: "",
            lexWarningCount: "",
            lexErrorCount: ""
        }
        // Checks to see whether the program ends with a EOPS ($) or not. If not then adds EOPS to the end of the token stream
        try {
            if (tokenArray[tokenArray.length - 1].value != "$" && reachedEnd) {

                var endToken = new Token("T_EOPS", "$", tokenArray[tokenArray.length - 1].line);
                tokenArray.push(endToken);

                lexWarningCount++;

                txt = txt + " LEXER --> | WARNING! NO EOPS [$] detected. Added to end-of-file at line " + tokenArray[tokenArray.length - 1].line + "...\n";
            }
        }
        // If Token Array is invalid or empty, notify the user of the error
        catch (error) {
            lexErrorCount++;

            console.log("Invalid Input..." + error);
            $('#log').val(txt + " LEXER --> | ERROR! Input did not generate valid Token Array...\n");
            scrollDown();
        }

        checkEOPS.tokenArray = tokenArray;
        checkEOPS.lexWarningCount = lexWarningCount;
        checkEOPS.lexErrorCount = lexErrorCount;

        return checkEOPS;
    }

    function printLastMessage(tokenArray, printTokens, lexWarningCount, lexErrorCount) {
        var printLastMessage = {
            tokenArray: "",
            lexWarningCount: "",
            lexErrorCount: ""
        }

        // Decides what to print for Final Lex Message
        if (printTokens) {
            // LEX Success
            lexComplete = true;

            //txt = $('#log').val();

            // Prints Final Lex Success Message
            $('#log').val(txt + "\nLex Completed With " + lexWarningCount + " WARNING(S) and " + lexErrorCount + " ERROR(S)" + "...\n_______________________________________________________________\n\n");

            //console.log($('#log').val());

            scrollDown();

            marqueeTokens = [];
            tableTokens = [];

            var tokenNumber = 0;

            // Prepares token for printing into marquee and table
            for (var m = 0; m < tokenArray.length; m++) {
                marqueeTokens[m] = "<span class=\"tokenStream\">" + "<span class=\"tokenStreamNum\">" + tokenNumber + "</span> " + ":: " + "<span class=\"tokenStreamText\">" + tokenArray[m].kind + " [ " + tokenArray[m].value + " ] " + "</span></span>";
                tableTokens[m] = "<tr class=\"tokenRow\"><td>" + tokenNumber + "</td><td>" + tokenArray[m].kind + "</td><td>" + tokenArray[m].value + "</td><td>" + tokenArray[m].line + "</td></tr>";
                tokenNumber++;
            }

            // Updates Progess Status Bar
            if (lexWarningCount == 0)
                $('#lexResults').html("<span style=\"color:green;\"> PASSED </span>");
            else
                $('#lexResults').html("<span style=\"color:#d58512;\"> PASSED </span>");

            // Prints token into marquee and table
            document.getElementById('marquee-holder').innerHTML = "<marquee id='token-banner' behavior='scroll' direction='left' onmouseover='this.stop();' onmouseout='this.start();' scrollamount='20'>" + marqueeTokens.join("") + "</marquee>";
            document.getElementById('tokenTable').innerHTML = "<th>Token Number</th><th>Token Type</th><th>Value</th><th>Line Number</th>" + tableTokens.join("");
        } 

        else {
            txt = $('#log').val();

            // Prints Final Lex Fail Message
            $('#log').val(txt + "\nLex Failed With " + lexWarningCount + " WARNING(S) and " + lexErrorCount + " ERROR(S)" + "...");

            scrollDown();

            // Updates Progess Status Bar
            $('#lexResults').html("<span style=\"color:red;\"> FAILED </span>");
        }

        printLastMessage.tokenArray = tokenArray;
        printLastMessage.lexWarningCount = lexWarningCount;
        printLastMessage.lexErrorCount = lexErrorCount;

        return printLastMessage;
    }
	function tokenBeautify(tokenString) {
		tokenString = tokenString.replaceAll("print", " print ");
		tokenString = tokenString.replaceAll("int", " int ");
		tokenString = tokenString.replaceAll("string", " string ");
		tokenString = tokenString.replaceAll("boolean", " boolean ");
		tokenString = tokenString.replaceAll("while", " while ");
		tokenString = tokenString.replaceAll("if", " if ");
		tokenString = tokenString.replaceAll("true", " true ");
		tokenString = tokenString.replaceAll("false", " false ");
		tokenString = tokenString.replaceAll("pr int", "print");
		
		return tokenString;
	}
}