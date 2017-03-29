function makeASTTokens() {
	var parseReturns = parse();
	
	// Initialize Make-AST-Token Variables
	var codeFrag = parseReturns.astLexemes;
	var tokens = [];
	var lineNum = 1;
	
	// Iterate through the condeFrag array to identify valid lexemes
	for (var i = 0; i < codeFrag.length; i++) {
		if (isMatch(/^\n+/, codeFrag[i]))
			lineNum++;

		lexeme = codeFrag[i].trim();

		if (lexeme !== undefined) {
			// RegEx for Print
			if (isMatch(/^print$/, lexeme)) {
				var token = new Token("T_PRINT", "print", lineNum);
				tokens.push(token);
			}
			// RegEx for While 
			else if (isMatch(/^while$/, lexeme)) {
				var token = new Token("T_WHILE", "while", lineNum);
				tokens.push(token);
			}
			// RegEx for If
			else if (isMatch(/^if$/, lexeme)) {
				var token = new Token("T_IF", "if", lineNum);
				tokens.push(token);
			}
			// RegEx for Variable Type
			else if (isMatch(/^int$|^string$|^boolean$/, lexeme)) {
				var type = lexeme.match(/^int$|^string$|^boolean$/);
				var token = new Token("T_VARIABLE_TYPE", type[0], lineNum);
				tokens.push(token);
			}
			// RegEx for Boolean Value
			else if (isMatch(/^true$|^false$/, lexeme)) {
				var boolVal = lexeme.match(/^true|false$/);
				var token = new Token("T_BOOLEAN_VALUE", boolVal[0], lineNum);
				tokens.push(token);
			}
			// RegEx for Left Brace
			else if (isMatch(/^{$/, lexeme)) {
				var token = new Token("T_OPENING_BRACE", "{", lineNum);
				tokens.push(token);
			}
			// RegEx for Right Brace
			else if (isMatch(/^}$/, lexeme)) {
				var token = new Token("T_CLOSING_BRACE", "}", lineNum);
				tokens.push(token);
			}
			// RegEx for Left Parenthesis
			else if (isMatch(/^\($/, lexeme)) {
				var token = new Token("T_OPENING_PARENTHESIS", "(", lineNum);
				tokens.push(token);
			}
			// RegEx for Right Parenthesis
			else if (isMatch(/^\)$/, lexeme)) {
				var token = new Token("T_CLOSING_PARENTHESIS", ")", lineNum);
				tokens.push(token);
			}
			// RegEx for End of Program Symbol
			else if (isMatch(/^\$$/, lexeme)) {
				var token = new Token("T_EOPS", "$", lineNum);
				tokens.push(token);
			}
			// RegEx for Equality Operator
			else if (isMatch(/^==$/, lexeme)) {
				var token = new Token("T_EQUALITY_OP", "==", lineNum);
				tokens.push(token);
			}
			// RegEx for Inequality Operator
			else if (isMatch(/^!=$/, lexeme)) {
				var token = new Token("T_INEQUALITY_OP", "!=", lineNum);
				tokens.push(token);
			}
			// RegEx for Assignment Operator
			else if (isMatch(/^=$/, lexeme)) {
				var token = new Token("T_ASSIGNMENT_OP", "=", lineNum);
				tokens.push(token);
			}
			// RegEx for Addition Operator
			else if (isMatch(/^\+$/, lexeme)) {
				var token = new Token("T_ADDITION_OP", "+", lineNum);
				tokens.push(token);
			}
			// RegEx for Identifiers
			else if (isMatch(/^[a-z]$/, lexeme)) {
				var iden = lexeme.match(/^[a-z]$/);
				var token = new Token("T_ID", iden[0], lineNum);
				tokens.push(token);
			}
			// RegEx for Digits
			else if (isMatch(/^[0-9]$/, lexeme)) {
				var digit = lexeme.match(/^[0-9]$/);
				var token = new Token("T_DIGIT", digit[0], lineNum);
				tokens.push(token);
			}
			// RegEx for Quotation
			else if (isMatch(/^"$/, lexeme)) {
				var token = new Token("T_QUOTE", "\"", lineNum);
				tokens.push(token);
			}
			// RegEx for String -- Either by String Blocks or CharLists ---
			else if (isMatch(/^(")([a-z \t]*)(")$/, lexeme)) {
				var string = lexeme.match(/^(")([a-z \t]*)(")$/);
				var token = new Token("T_QUOTE", "\"", lineNum);
				var token2 = new Token("T_CHARLIST", string[2], lineNum);
				var token3 = new Token("T_QUOTE", "\"", lineNum);
				tokens.push(token);
				tokens.push(token2);
				tokens.push(token3);
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
		}
	}

	tokens = tokens.clean(undefined);
	
	var makeASTTokensReturns = {
		tokenArray: tokens,
		totalWarningCount: parseReturns.totalWarningCount,
		totalErrorCount: parseReturns.totalErrorCount
	}
	
	if (verbose)
		console.log(makeASTTokensReturns);
	
	return makeASTTokensReturns;
}