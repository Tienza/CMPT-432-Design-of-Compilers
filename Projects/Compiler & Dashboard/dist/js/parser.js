function parse() {
	// Assigns LEXER return values to be used in PARSER
	var lexReturns = lex();
	var lambdaChar = "\u03BB";
	
	if (lexComplete) {
		// Prints start of Parsing Session
		var txt = $('#log').val();
		txt = $('#log').val(txt + "Beginning Parsing Session...\n\n");
		
		if (verbose)
			console.log(lexReturns);
		
		// Sets carry-over variables from LEXER to be used in PARSER
		var tokens = lexReturns.tokenArray;
		var totalWarningCount = lexReturns.warningCount;
		var totalErrorCount = lexReturns.errorCount;
		
		// Resets and initialize LEXER Error and Warning Count
		var parseErrorCount = 0;
		var parseWarningCount = 0;
		
		var currentToken = 0;
		
		parseProgram();
	}
	
	function parseProgram() {
		// Initialize parsing of Block
		parseBlock();
		
		// Checks and consumes the character following the Block is a T_EOPS
		if (matchToken(tokens[currentToken].kind, "T_EOPS")) {
			if (verbose)
				printParseMessage("T_EOPS", "");
			consumeToken();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("$");
	}
	
	function parseBlock() {
		// Checks and consumes the required first character of a Block [ { ]
		if (matchToken(tokens[currentToken].kind, "T_OPENING_BRACE")) {
			if (verbose)
				printParseMessage("T_OPENING_BRACE", "");
			consumeToken();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("{");
		
		// Initialize parsing of StatementList
		parseStatementList();
		
		// Checks and consumes the required last character of a Block [ } ]
		if (matchToken(tokens[currentToken].kind, "T_CLOSING_BRACE")){
			if (verbose)
				printParseMessage("T_CLOSING_BRACE", "");
			consumeToken();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("}");
	}
	
	function parseStatementList() {
		// Checks to see if the following is a statement is another statement
		if (tokens[currentToken].kind == "T_PRINT" || tokens[currentToken].kind == "T_ID" && tokens[currentToken+1].kind == "T_ASSIGNMENT_OP" || tokens[currentToken].kind == "T_VARIABLE_TYPE" && tokens[currentToken+1].kind == "T_ID" || tokens[currentToken].kind == "T_WHILE" || tokens[currentToken].kind == "T_IF" || tokens[currentToken].kind == "T_OPENING_BRACE") {
			if (verbose)
				printParseMessage("Statement", "Statement");
			// Initialize parsing of Statement
			parseStatement();	
		}
		// Checks to see if following the statement is another statement
		if (tokens[currentToken].kind == "T_PRINT" || tokens[currentToken].kind == "T_ID" && tokens[currentToken+1].kind == "T_ASSIGNMENT_OP" || tokens[currentToken].kind == "T_VARIABLE_TYPE" && tokens[currentToken+1].kind == "T_ID" || tokens[currentToken].kind == "T_WHILE" || tokens[currentToken].kind == "T_IF" || tokens[currentToken].kind == "T_OPENING_BRACE") {
			if (verbose)
				printParseMessage("StatementList", "Statement");
			// Initialize parsing of Statement
			parseStatementList();
		}
		// Empty production
		else {
			if (verbose)
				printParseMessage(lambdaChar, "");
		}
	}
	
	function parseStatement() {
		// Checks to see if the following token is the start of a print statement
		if (tokens[currentToken].kind == "T_PRINT") {
			if (verbose)
				printParseMessage("PrintStatement", "");
			// Initialize parsing of PrintStatement
			parsePrint();
		}
		// Checks to see if the following token is the start of an assignment statement
		else if (tokens[currentToken].kind == "T_ID" && tokens[currentToken+1].kind == "T_ASSIGNMENT_OP") {
			if (verbose)
				printParseMessage("AssignmentStatement", "T_ID & T_ASSIGNMENT_OP");
			// Initialize parsing of AssignmentStatement
			parseAssignment();
		}
		
		else if (tokens[currentToken].kind == "T_VARIABLE_TYPE" && tokens[currentToken+1].kind == "T_ID") {
			if (verbose)
				printParseMessage("T_VARIABLE_TYPE", "T_VARIABLE_TYPE & T_ID");
			parseVarDecl();
		}
		
		else if (tokens[currentToken].kind == "T_WHILE") {
			if (verbose)
				printParseMessage("T_WHILE");
			console.log("While Statement", "");
		}
		
		else if (tokens[currentToken].kind == "T_IF") {
			if (verbose)
				printParseMessage("T_IF");
			console.log("IF Statement", "");
		}
		
		else if (tokens[currentToken].kind == "T_OPENING_BRACE") {
			if (verbose)
				printParseMessage("T_OPENING_BRACE", "");
			parseBlock();
		}
		// Throws an error if the character does not match what is expected
		else 
			throwParseError("print | T_ID & T_ASSIGNMENT_OP | T_ID | while | if | {");
	}
	
	function parseVarDecl() {
		// Checks required first character of variable declaration [ T_VARIABLE_TYPE ]
		if (matchToken(tokens[currentToken].kind, "T_VARIABLE_TYPE")) {
			if (verbose)
				printParseMessage("T_VARIABLE_TYPE", "");
			// Initialize parsing of Type
			parseType();
		}
		// Throws an error if the character does not match what is expected
		else 
			throwParseError("T_VARIABLE_TYPE");
		
		// Checks required second character of variable declaration [ T_ID ]
		if (matchToken(tokens[currentToken].kind, "T_ID")) {
			if (verbose)
				printParseMessage("T_ID", "");
			// Initialize parsing of Id
			parseId();
		}
		// Throws an error if the character does not match what is expected
		else 
			throwParseError("T_ID");
	}
	
	function parseType() {
		// Checks and consumes the required first character of type [ T_VARIABLE_TYPE ]
		if (matchToken(tokens[currentToken].kind, "T_VARIABLE_TYPE")) {
			if (verbose)
				printParseMessage("T_VARIABLE_TYPE", tokens[currentToken].value);
			consumeToken();
		}
	}
	
	function parseAssignment() {
		// Checks required first character of assignment statement [ T_ID ]
		if (matchToken(tokens[currentToken].kind, "T_ID")) {
			if (verbose)
				printParseMessage("T_ID", "T_ID");
			parseId();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("T_ID")
		
		// Checks and consumes required second character of assignment statement [ T_ASSIGNMENT_OP ]
		if (matchToken(tokens[currentToken].kind, "T_ASSIGNMENT_OP")) {
			if (verbose)
				printParseMessage("T_ASSIGNMENT_OP", tokens[currentToken].value);
			consumeToken();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("=")
		
		// Initialize parsing of Expr
		parseExpr();
	}
	
	function parseId() {
		// Checks and consumes the required first character of Id [ T_ID ]
		if (matchToken(tokens[currentToken].kind, "T_ID")) {
			if (verbose)
				printParseMessage("T_ID", tokens[currentToken].value);
			consumeToken();
		}
		else
			throwParseError("T_ID");
	};
	
	function parsePrint() {
		// Checks and consumes the required first character of print [ T_PRINT ]
		if (matchToken(tokens[currentToken].kind, "T_PRINT")) {
			if (verbose)
				printParseMessage("T_PRINT", "");
			consumeToken();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("print");
		
		// Checks and consumes the required second character of print [ ( ]
		if (matchToken(tokens[currentToken].kind, "T_OPENING_PARENTHESIS")) {
			if (verbose)
				printParseMessage("T_OPENING_PARENTHESIS", "");
			consumeToken();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("(");
		
		// Initialize parsing of Expr
		parseExpr();
		
		// Checks and consumes the required last character of print [ ) ]
		if (matchToken(tokens[currentToken].kind, "T_CLOSING_PARENTHESIS")) {
			if (verbose)
				printParseMessage("T_CLOSING_PARENTHESIS", "");
			consumeToken();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError(")");
	}
	
	function parseExpr() {
		// Checks the required first character of IntExpr [ T_DIGIT ]
		if (matchToken(tokens[currentToken].kind, "T_DIGIT")) {
			if (verbose)
				printParseMessage("Expr", "IntExpr");
			// Initialize parsing of IntExpr
			parseIntExpr();
		}
		// Checks the required first character of IntExpr [ T_QUOTE ]
		else if (matchToken(tokens[currentToken].kind, "T_QUOTE")) {
			if (verbose)
				printParseMessage("Expr", "StringExpr");
			// Initialize parsing of StringExpr
			parseStringExpr();
		}
		// Checks the required first character of Id [ T_ID ]
		else if (matchToken(tokens[currentToken].kind, "T_ID")) {
			if (verbose)
				printParseMessage("Expr", "Id");
			// Initialize parsing of Id
			parseId();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("IntExpr || StringExpr || BooleanExpr || Id");
	}
	
	function parseStringExpr() {
		// Checks and consumes the required first character of StringExpr [ T_QUOTE ]
		if (matchToken(tokens[currentToken].kind, "T_QUOTE")) {
			if (verbose)
				printParseMessage("T_QUOTE", "");
			consumeToken();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("\"");
		
		// Initialize parsting of CharList
		parseCharList();
			
		// Checks and consumes the required last character of StringExpr [ T_QUOTE ]
		if (matchToken(tokens[currentToken].kind, "T_QUOTE")) {
			if (verbose)
				printParseMessage("T_QUOTE", "");
			consumeToken();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("\"");
	}
	
	function parseCharList() {
		// Checks the required first character of CharList [ T_CHAR ]
		if (matchToken(tokens[currentToken].kind, "T_CHAR")) {
			if (verbose)
				printParseMessage("T_CHAR", "");
			parseChar();
		}
		
		else {
			if (verbose)
				printParseMessage(lambdaChar, "");
		}
	}
	
	function parseChar() {
		// Checks and consumes the required first character of Char [ T_CHAR ]
		if (matchToken(tokens[currentToken].kind, "T_CHAR")) {
			if (verbose)
				printParseMessage("T_CHAR", tokens[currentToken].value);
			consumeToken();
			parseCharList();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("T_CHAR");
	}
	
	function parseIntExpr() {
		// Checks the required first and second character of AdditionOp [ T_DIGIT & T_ADDITION_OP ]
		if (matchToken(tokens[currentToken].kind, "T_DIGIT") && matchToken(tokens[currentToken+1].kind, "T_ADDITION_OP")) {
			if (verbose)
				printParseMessage("IntExpr", "");
			// Initialize parsing of digit
			parseDigit();
			// Initialize parsing of IntOp
			parseIntOp();
			// Initialize parsing of Expr
			parseExpr();
			
		}
		// Checks the required character to be a digit [ T_DIGIT ]
		else if (matchToken(tokens[currentToken].kind, "T_DIGIT")) {
			if (verbose)
				printParseMessage("IntExpr", "IntExpr");
			parseDigit();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("T_DIGIT & T_ADDITION_OP || T_DIGIT");
	}
	
	function parseIntOp() {
		txt = $('#log').val();
		
		// Checks and consumes the required character of IntOp [ T_ADDITION_OP ]
		if (matchToken(tokens[currentToken].kind, "T_ADDITION_OP")) {
			if (verbose)
				printParseMessage("T_ADDITION_OP", tokens[currentToken].value);
			consumeToken();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("+");
	}
	
	function parseDigit() {
		txt = $('#log').val();
		
		// Checks and consumes the required character to be a digit [ T_DIGIT ]
		if (matchToken(tokens[currentToken].kind, "T_DIGIT")) {
			if (verbose)
				printParseMessage("T_DIGIT", tokens[currentToken].value);
			consumeToken();
		}
		// Throws an error if the character does not match what is expected
		else
			throwParseError("T_DIGIT");
	}
	
	// Matches token and returns True if it matches
	function matchToken(tokenKind, expectedKind){
		var match;
		
		console.log(tokens[currentToken]);
		
		if (verbose)
			console.log(currentToken);
		
		if (tokenKind == expectedKind)
			match = true;
		else
			match = false;
		
		return match;
	}
	// Increments token count and moves to next token
	function consumeToken() {
		currentToken++;
	}
	
	// Funtions to print last message for parser
	function printLastParseMessage(parseComplete) {
		txt = $('#log').val();
		
		if (parseComplete) {
			txt = $('#log').val(txt + "\nParse Completed With " + parseWarningCount + " WARNING(S) and " + parseErrorCount + " ERROR(S)" + "...\n\n");
		}
		
		else {
			txt = $('#log').val(txt + "\nParse Failed With " + parseWarningCount + " WARNING(S) and " + parseErrorCount + " ERROR(S)" + "...");
		}
		
		scrollDown();
	}
	
	function throwParseError(expectVal) {
		txt = $('#log').val();
		
		txt = $('#log').val(txt + " PARSER --> | ERROR! Expecting [ " + expectVal + " ] found [ " + tokens[currentToken].value + " ] on line " + tokens[currentToken].line + "...\n");
		parseErrorCount++;
		printLastParseMessage(parseComplete);
		scrollDown();
		throw new Error("HOLY SHIT! IT DIED...");
	}
	
	function printParseMessage(expectVal, foundVal) {
		txt = $('#log').val();
		
		if (foundVal !== "")
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ " + expectVal + " ] found [ " + foundVal + " ] on line " + tokens[currentToken].line + "...\n");
		else if (expectVal == lambdaChar)
			txt = $('#log').val(txt + " PARSER --> | PASSED! " + expectVal + " production on line " + tokens[currentToken].line + "...\n");
		else
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ " + expectVal + " ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
		
		scrollDown();
	}
}