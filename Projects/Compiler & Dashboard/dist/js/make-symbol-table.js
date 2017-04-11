function makeSymbolTable() {
	var makeASTReturns = makeAST();
	
	// Creates local copy of TokenArray for processing to make AST
	var tokens = makeASTReturns.tokenArray;
	
	// Initialize AST Variables
	var currentToken = 0;

	// Creates Symbol Tree and adds root node
	var scope = -1;
	var scopeLevel = -1;
	var st = new symbolTable();
	var symbolTableStrings = "";

	// Symbol Global Variables
	var variableKey = "";
	var variableType = "";
	var variableLine = 0;
	
	parseProgram();

	if (verbose) {
		traverseTree(st.cur);
		console.log(st.toString());
	}
	
	var makeSymbolTableReturns = {
		AST: makeASTReturns.AST,
		ST: st,
		tokenArray: tokens,
		totalWarningCount: makeASTReturns.totalWarningCount,
		totalErrorCount: makeASTReturns.totalErrorCount
	}
	
	printSymbolTable(symbolTableStrings);
	
	if (verbose)
		console.log(makeSymbolTableReturns);

	return makeSymbolTableReturns;

	function traverseTree(node) {
		if (node.children.length != 0) {
			node.children.forEach(function(element) {
				traverseTree(element);
			});
		}
	}
	
	function parseProgram() {
		// Initialize parsing of Block
		parseBlock();
		
		// Checks and consumes the character following the Block is a T_EOPS
		if (matchToken(tokens[currentToken].kind, "T_EOPS")) {
			consumeToken();
		}
		
		// Checks to see if there is another program (If there is then run parse again)
		if (currentToken < tokens.length) {
			parseProgram();
		}
	}
	
	function parseBlock() {
		scopeLevel++;
		scope++;
		
		// Creates Scope Node in Symbol Tree
		st.addNode("ScopeLevel: "+scopeLevel, "branch", scope);
		
		// Checks and consumes the required first character of a Block [ { ]
		if (matchToken(tokens[currentToken].kind, "T_OPENING_BRACE")) {
			consumeToken();
		}

		// Initialize parsing of StatementList
		parseStatementList();
		
		// Checks and consumes the required last character of a Block [ } ]
		if (matchToken(tokens[currentToken].kind, "T_CLOSING_BRACE")){
			consumeToken();
		}
		
		scopeLevel--;
		// Kicks you one Scope up the Symbol Tree
		st.kick();
	}
	
	function parseStatementList() {
		// Checks to see if the following is a statement is another statement
		if (tokens[currentToken].kind == "T_PRINT" || tokens[currentToken].kind == "T_ID" || tokens[currentToken].kind == "T_VARIABLE_TYPE" || tokens[currentToken].kind == "T_WHILE" || tokens[currentToken].kind == "T_IF" || tokens[currentToken].kind == "T_OPENING_BRACE") {
			// Initialize parsing of Statement
			parseStatement();	
		}

		// Checks to see if following the statement is another statement
		if (tokens[currentToken].kind == "T_PRINT" || tokens[currentToken].kind == "T_ID" || tokens[currentToken].kind == "T_VARIABLE_TYPE" || tokens[currentToken].kind == "T_WHILE" || tokens[currentToken].kind == "T_IF" || tokens[currentToken].kind == "T_OPENING_BRACE") {
			// Initialize parsing of Statement
			parseStatementList();
		}
		// Empty production
		else {
			/* Do Nothing λ Production */
		}
	}
	
	function parseStatement() {
		// Checks to see if the following token is the start of a PrintStatement
		if (tokens[currentToken].kind == "T_PRINT") {
			// Initialize parsing of PrintStatement
			parsePrint();
		}
		// Checks to see if the following token is the start of an AssignmentStatement
		else if (tokens[currentToken].kind == "T_ID") {
			// Initialize parsing of AssignmentStatement
			parseAssignment();
		}
		// Checks to see if the following token is the start of a VarDecl
		else if (tokens[currentToken].kind == "T_VARIABLE_TYPE") {
			// Initialize parsing of VarDecl
			parseVarDecl();
		}
		// Checks to see if the following token is the start of a WhileStatement
		else if (tokens[currentToken].kind == "T_WHILE") {
			// Initialize parsing of WhileStatement
			parseWhile();
		}
		// Checks to see if the following token is the start of a IfStatement
		else if (tokens[currentToken].kind == "T_IF") {
			// Initialize parsing of IfStatement
			parseIf();
		}
		
		else if (tokens[currentToken].kind == "T_OPENING_BRACE") {
			parseBlock();
		}
	}
	
	function parseIf() {
		// Checks and consumes the required first character of IfStatement
		if (matchToken(tokens[currentToken].kind, "T_IF")) {
			consumeToken();
		}
		
		// Initialize parsing of BooleanExpr
		parseBooleanExpr();
		
		// Initialize parsing of Block
		parseBlock();
	}
	
	function parseWhile() {
		// Checks and consumes the required first character of WhileStatement
		if (matchToken(tokens[currentToken].kind, "T_WHILE")) {
			consumeToken();
		}
		
		// Initialize parsing of BooleanExpr
		parseBooleanExpr();
		
		// Initialize parsing of Block
		parseBlock();
	}
	
	function parseVarDecl() {
		// Checks required first character of VariableDeclaration [ T_VARIABLE_TYPE ]
		if (matchToken(tokens[currentToken].kind, "T_VARIABLE_TYPE")) {
			// Initialize parsing of Type
			parseType();
		}
		
		// Checks required second character of VariableDeclaration [ T_ID ]
		if (matchToken(tokens[currentToken].kind, "T_ID")) {
			// Initialize parsing of Id
			parseId();
		}
		
		// Adds Symbol to Symbol Tree
		var symbol = new Symbol(variableKey, variableType, variableLine, st.cur.scope, scopeLevel, false, false);
		st.cur.symbols.push(symbol);
		symbolTableStrings = symbolTableStrings + "<tr class=\"tokenRow\"><td>" + symbol.key + "</td><td>" + symbol.type + "</td><td>" + symbol.scope + "</td><td>" + symbol.scopeLevel + "</td><td>" + symbol.line + "</td></tr>";
		
		// Clears data stored in variableKey && variableType
		variableKey = "";
		variableType = ""; 
		variableLine = 0;
	}
	
	function parseType() {
		// Checks and consumes the required first character of type [ T_VARIABLE_TYPE ]
		if (matchToken(tokens[currentToken].kind, "T_VARIABLE_TYPE")) {
			// Assigns Type to Global Variable Type
			variableType = tokens[currentToken].value;
			consumeToken();
		}
	}
	
	function parseAssignment() {
		// Checks required first character of assignment statement [ T_ID ]
		if (matchToken(tokens[currentToken].kind, "T_ID")) {
			parseId();
		}
		
		// Checks and consumes required second character of assignment statement [ T_ASSIGNMENT_OP ]
		if (matchToken(tokens[currentToken].kind, "T_ASSIGNMENT_OP")) {
			consumeToken();
		}
		
		// Initialize parsing of Expr
		parseExpr();
	}
	
	function parseId() {
		// Checks and consumes the required first character of Id [ T_ID ]
		if (matchToken(tokens[currentToken].kind, "T_ID")) {
			// Assigns ID to Global Variable Key
			variableKey = tokens[currentToken].value;
			variableLine = tokens[currentToken].line;
			consumeToken();
		}
	};
	
	function parsePrint() {
		// Checks and consumes the required first character of print [ T_PRINT ]
		if (matchToken(tokens[currentToken].kind, "T_PRINT")) {
			consumeToken();
		}
		
		// Checks and consumes the required second character of print [ ( ]
		if (matchToken(tokens[currentToken].kind, "T_OPENING_PARENTHESIS")) {
			consumeToken();
		}
		
		// Initialize parsing of Expr
		parseExpr();
		
		// Checks and consumes the required last character of print [ ) ]
		if (matchToken(tokens[currentToken].kind, "T_CLOSING_PARENTHESIS")) {
			consumeToken();
		}
	}
	
	function parseExpr() {
		// Checks the required first character of IntExpr [ T_DIGIT ]
		if (matchToken(tokens[currentToken].kind, "T_DIGIT")) {
			// Initialize parsing of IntExpr
			parseIntExpr();
		}
		// Checks the required first character of IntExpr [ T_QUOTE ]
		else if (matchToken(tokens[currentToken].kind, "T_QUOTE")) {
			// Initialize parsing of StringExpr
			parseStringExpr();
		}
		// Checks the first possible character of BooleanExpr [ T_OPENING_PARENTHESIS ]
		else if (matchToken(tokens[currentToken].kind, "T_OPENING_PARENTHESIS")) {
			// Initialize parsing of BooleanExpr
			parseBooleanExpr();
		}
		// Checks the second possible character of BooleanExpr [ T_BOOLEAN_VALUE ]
		else if (matchToken(tokens[currentToken].kind, "T_BOOLEAN_VALUE")) {
			// Initialize parsing of BooleanExpr
			parseBooleanExpr();
		}
		// Checks the required first character of Id [ T_ID ]
		else if (matchToken(tokens[currentToken].kind, "T_ID")) {
			// Initialize parsing of Id
			parseId();
		}
	}
	
	function parseBooleanExpr() {
		// Checks and consumes the required first character of BooleanExpr(1) [ T_OPENING_PARENTHESIS ]
		if (matchToken(tokens[currentToken].kind, "T_OPENING_PARENTHESIS")) {
			consumeToken();
			
			if (matchToken(tokens[currentToken+1].value, "==")) {
				/* Do Nothing */
			}
			else if (matchToken(tokens[currentToken+3].value, "==")) {
				/* Do Nothing */
			}
			else {
				/* Do Nothing */
			}
				
			// Initialize parsing of Expr
			parseExpr();
			// Initialize parsing of BoolOp
			parseBoolOp();
			// Initialize parsing of Expr
			parseExpr();
			// Checks and consumes the required last character of BooleanExpr(1) [ T_CLOSING_PARENTHESIS ]
			if (matchToken(tokens[currentToken].kind, "T_CLOSING_PARENTHESIS")) {
				consumeToken();
			}
		}
		// Checks the required first character of BooleanExpr(2) [ T_BOOLEAN_VALUE ]
		else if (matchToken(tokens[currentToken].kind, "T_BOOLEAN_VALUE")) {
			parseBoolVal();
		}
	}
	
	function parseBoolOp() {
		// Checks and consumes the first possible character of BoolOp [ T_EQUALITY_OP ]
		if (matchToken(tokens[currentToken].kind, "T_EQUALITY_OP")) {
			consumeToken();
		}
		// Checks and consumes the second possible character of BoolOp [ T_EQUALITY_OP ]
		else if (matchToken(tokens[currentToken].kind, "T_INEQUALITY_OP")) {
			consumeToken();
		}
	}
	
	function parseBoolVal() {
		// Checks and consumes the first required character of BoolOp [ T_BOOLEAN_VALUE ]
		if (matchToken(tokens[currentToken].kind, "T_BOOLEAN_VALUE")) {
			consumeToken();
		}
	}
	
	function parseStringExpr() {
		// Checks and consumes the required first character of StringExpr [ T_QUOTE ]
		if (matchToken(tokens[currentToken].kind, "T_QUOTE")) {
			consumeToken();
		}
		
		// Initialize parsting of CharList
		parseCharList();
		
		var fullString = tokens[currentToken-1].value;
		
		// Checks and consumes the required last character of StringExpr [ T_QUOTE ]
		if (matchToken(tokens[currentToken].kind, "T_QUOTE")) {
			consumeToken();
		}
	}
	
	function parseCharList() {
		// Checks the required first character of CharList [ T_CHAR ]
		if (matchToken(tokens[currentToken].kind, "T_CHARLIST")) {
			consumeToken()
		}
		// Empty production
		else {
			/* Do Nothing λ Production */
		}
	}
	
	function parseIntExpr() {
		// Checks the required first and second character of AdditionOp [ T_DIGIT & T_ADDITION_OP ]
		if (matchToken(tokens[currentToken].kind, "T_DIGIT") && matchToken(tokens[currentToken+1].kind, "T_ADDITION_OP")) {
			// Initialize parsing of digit
			parseDigit();
			// Initialize parsing of IntOp
			parseIntOp();
			// Initialize parsing of Expr
			parseExpr();
			// Kicks you one level up the tree
			ast.kick();
			
		}
		// Checks the required character to be a digit [ T_DIGIT ]
		else if (matchToken(tokens[currentToken].kind, "T_DIGIT")) {
			parseDigit();
		}
	}
	
	function parseIntOp() {
		// Checks and consumes the required character of IntOp [ T_ADDITION_OP ]
		if (matchToken(tokens[currentToken].kind, "T_ADDITION_OP")) {
			consumeToken();
		}
	}
	
	function parseDigit() {
		// Checks and consumes the required character to be a digit [ T_DIGIT ]
		if (matchToken(tokens[currentToken].kind, "T_DIGIT")) {
			consumeToken();
		}
	}
	
	// Matches token and returns True if it matches
	function matchToken(tokenKind, expectedKind){
		var match;
		
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
	
	// Prints out the Symbol Table
	function printSymbolTable(symbolTableStrings) {
		// Prints out the Symbol Table Based - Defined by Order of Declaration
		document.getElementById('symbolTable').innerHTML = "<th class=\"symbolHeader\">Key</th><th class=\"symbolHeader\">Type</th><th class=\"symbolHeader\">Scope</th><th class=\"symbolHeader\">Scope Level</th><th class=\"symbolHeader\">Line Number</th>" + symbolTableStrings;
	}
}