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
		txt = $('#log').val();

		parseBlock();
		
		if(matchToken(tokens[currentToken].kind, "T_EOPS")) {
			txt = $('#log').val();
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_EOPS ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			consumeToken();
		}
		else
			throw new Error("HOLY SHIT! IT DIED...");
		
		scrollDown();
	}
	
	function parseBlock() {
		txt = $('#log').val();
		
		if (matchToken(tokens[currentToken].kind, "T_OPENING_BRACE")) {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_OPENING_BRACE ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			consumeToken();
		}
		else {
			txt = $('#log').val(txt + " PARSER --> | ERROR! Expecting [ { ] found " + tokens[currentToken].value + " on line " + tokens[currentToken].line + "...\n");
			throw new Error("HOLY SHIT! IT DIED...");
		}
		
		scrollDown();
		
		parseStatementList();
		
		txt = $('#log').val();
		
		if (matchToken(tokens[currentToken].kind, "T_CLOSING_BRACE")){
			txt = $('#log').val();
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_CLOSING_BRACE ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			consumeToken();
		}
		else {
			txt = $('#log').val(txt + " PARSER --> | ERROR! Expecting [ } ] found " + tokens[currentToken].value + " on line " + tokens[currentToken].line + "...\n");
			throw new Error("HOLY SHIT! IT DIED...");
		}
		
		scrollDown();
	}
	
	function parseStatementList() {
		txt = $('#log').val();
		
		if (tokens[currentToken].kind == "T_PRINT" || tokens[currentToken+1] == "T_ASSIGNMENT_OP" || tokens[currentToken].kind == "T_ID" || tokens[currentToken].kind == "T_WHILE" || tokens[currentToken].kind == "T_IF" || tokens[currentToken].kind == "T_OPENING_BRACE") {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Now parsing Statement...\n");
			parseStatement();	
		}
		else
			txt = $('#log').val(txt + " PARSER --> | PASSED! " + lambdaChar + " production on line " + tokens[currentToken].line + "...\n");
		
		scrollDown();
	}
	
	function parseStatement() {
		
		txt = $('#log').val();
		
		if (tokens[currentToken].kind == "T_PRINT") {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_PRINT ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			parsePrint();
		}
		
		else if (tokens[currentToken+1] == "T_ASSIGNMENT_OP") {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_ASSIGNMENT ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			console.log("Assignment Statement");
		}
		
		else if (tokens[currentToken].kind == "T_ID") {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_ID ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			console.log("Variable Declaration");
		}
		
		else if (tokens[currentToken].kind == "T_WHILE") {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_WHILE ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			console.log("While Statement");
		}
		
		else if (tokens[currentToken].kind == "T_IF") {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_IF ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			console.log("IF Statement");
		}
		
		else if (tokens[currentToken].kind == "T_OPENING_BRACE") {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_OPENING_BRACE ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			parseBlock();
		}
		
		else {
			txt = $('#log').val();
			
			txt = $('#log').val(txt + " PARSER --> | ERROR! Expecting [ print ]| [ T_ID & T_ASSIGNMENT_OP ] | [ T_ID ] | [ while ] | [ if ] | [ { ] found " + tokens[currentToken].value + " on line " + tokens[currentToken].line + "...\n");
			throw new Error("HOLY SHIT! IT DIED...");
		}
		
		scrollDown();
	}
	
	function parsePrint() {	
		txt = $('#log').val();	
		
		if (matchToken(tokens[currentToken].kind, "T_PRINT")) {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_PRINT ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			consumeToken();
		}
		
		else {
			txt = $('#log').val(txt + " PARSER --> | ERROR! Expecting [ print ] found [ " + tokens[currentToken].value + " ] on line " + tokens[currentToken].line + "...\n");
			throw new Error("HOLY SHIT! IT DIED...");
		}
		
		scrollDown();
		
		txt = $('#log').val();
		
		if (matchToken(tokens[currentToken].kind, "T_OPENING_PARENTHESIS")) {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_OPENING_PARENTHESIS ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			consumeToken();
		}
		
		else {
			txt = $('#log').val(txt + " PARSER --> | ERROR! Expecting [ ( ] found [ " + tokens[currentToken].value + " ] on line " + tokens[currentToken].line + "...\n");
			throw new Error("HOLY SHIT! IT DIED...");
		}
		
		scrollDown();
		
		parseExpr();
		
		txt = $('#log').val();
		
		if (matchToken(tokens[currentToken].kind, "T_CLOSING_PARENTHESIS")) {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_CLOSING_PARENTHESIS ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			consumeToken();
		}
		
		else {
			txt = $('#log').val(txt + " PARSER --> | ERROR! Expecting [ ) ] found [ " + tokens[currentToken].value + " ] on line " + tokens[currentToken].line + "...\n");
			throw new Error("HOLY SHIT! IT DIED...");
		}
		
		scrollDown();
	}
	
	function parseExpr() {
		txt = $('#log').val();
		
		if (matchToken(tokens[currentToken].kind, "T_DIGIT")) {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ IntExpr ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			parseIntExpr();
		}
		
		else {
			txt = $('#log').val(txt + " PARSER --> | ERROR! Expecting [ IntExpr || StringExpr || BooleanExpr || Id ] found [ " + tokens[currentToken].value + " ] on line " + tokens[currentToken].line + "...\n");
			throw new Error("HOLY SHIT! IT DIED...");
		}
		
		scrollDown();
	}
	
	function parseIntExpr() {
		txt = $('#log').val();
		
		if (matchToken(tokens[currentToken].kind, "T_DIGIT") && matchToken(tokens[currentToken+1].kind, "T_ADDITION_OP")) {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_DIGIT ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			consumeToken()
			txt = $('#log').val();
			
			parseIntOp();
			
			parseExpr();
			
		}
		
		else if (matchToken(tokens[currentToken].kind, "T_DIGIT")) {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_DIGIT ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			consumeToken();
		}
		
		else {
			txt = $('#log').val(txt + " PARSER --> | ERROR! Expecting [ T_DIGIT & T_ADDITION_OP || T_DIGIT ] found [ " + tokens[currentToken].value + " ] on line " + tokens[currentToken].line + "...\n");
			throw new Error("HOLY SHIT! IT DIED...");
		}
		
		scrollDown();
	}
	
	function parseIntOp() {
		txt = $('#log').val();
		
		if (matchToken(tokens[currentToken].kind, "T_ADDITION_OP")) {
			txt = $('#log').val(txt + " PARSER --> | PASSED! Expecting [ T_ADDITION_OP ] found [ " + tokens[currentToken].kind + " ] on line " + tokens[currentToken].line + "...\n");
			consumeToken();
		}
		
		else {
			txt = $('#log').val(txt + " PARSER --> | ERROR! Expecting [ + ] found [ " + tokens[currentToken].value + " ] on line " + tokens[currentToken].line + "...\n");
			throw new Error("HOLY SHIT! IT DIED...");
		}
		
		scrollDown();
	}
	
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
	
	function consumeToken() {
		currentToken++;
	}
	
}