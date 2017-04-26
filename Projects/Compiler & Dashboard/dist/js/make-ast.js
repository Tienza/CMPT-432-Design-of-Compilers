function makeAST() {
	var makeASTTokensReturns = makeASTTokens();
	
	// Creates local copy of TokenArray for processing to make AST
	var tokens = makeASTTokensReturns.tokenArray;
	
	// Initialize AST Variables
	var currentToken = 0;
	
	// Creates Abstract Syntax Tree and adds root node
	var ast = new Tree();
	ast.addNode("Root", "branch");

	// Creates Scope Tree to keep track and add scope to AST
	var scope = -1;
	var scopeTree = new symbolTree();
	
	parseProgram();
	
	$('#astLog').val(ast.toString());
	$('#astLog2').val(ast.toString());

	var makeASTReturns = {
		AST: ast,
		tokenArray: tokens,
		totalWarningCount: makeASTTokensReturns.totalWarningCount,
		totalErrorCount: makeASTTokensReturns.totalErrorCount
	}

	return makeASTReturns;
	
	/********************************************** Reparse - Make AST **********************************************/
	function parseProgram() {
		// Creates a Program Branch
		ast.addNode("Program", "branch");
		
		// Initialize parsing of Block
		parseBlock();
		
		// Checks and consumes the character following the Block is a T_EOPS
		if (matchToken(tokens[currentToken].kind, "T_EOPS")) {
			consumeToken();
		}
		
		// Kicks you one level up the tree
		ast.kick();
		
		// Checks to see if there is another program (If there is then run parse again)
		if (currentToken < tokens.length) {
			parseProgram();
		}
	}
	
	function parseBlock() {
		scope++;

		// Creates Scope Node in Symbol Tree
		scopeTree.addNode("ScopeLevel: "+scope, "branch", scope);

		// Creates a Block Branch
		ast.addNode("Block", "branch", tokens[currentToken].line, scopeTree.cur.scope);
		
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
		
		// Kicks you one level up the tree
		scopeTree.kick();
		ast.kick();
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

	function parsePrint() {
		// Creates a PrintStatement Branch
		ast.addNode("PrintStatement", "branch", tokens[currentToken].line, scopeTree.cur.scope);
		
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
		
		// Kicks you one level up the tree
		ast.kick();
	}

	function parseAssignment() {
		// Creates a AssignmentStatement Branch
		ast.addNode("AssignmentStatement", "branch", tokens[currentToken].line, scopeTree.cur.scope);
		
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
		
		// Kicks you one level up the tree
		ast.kick();
	}

	function parseVarDecl() {
		// Creates a VariableDeclaration Branch
		ast.addNode("VariableDeclaration", "branch", tokens[currentToken].line, scopeTree.cur.scope);
		
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

		// Kicks you one level up the tree
		ast.kick();
	}

	function parseWhile() {
		// Creates a WhileStatement Branch
		ast.addNode("WhileStatement", "branch", tokens[currentToken].line, scopeTree.cur.scope);
		
		// Checks and consumes the required first character of WhileStatement
		if (matchToken(tokens[currentToken].kind, "T_WHILE")) {
			consumeToken();
		}
		
		// Initialize parsing of BooleanExpr
		parseBooleanExpr();
		
		// Initialize parsing of Block
		parseBlock();
		
		// Kicks you one level up the tree
		ast.kick();
	}
	
	function parseIf() {
		// Creates a IfStatement Branch
		ast.addNode("IfStatement", "branch", tokens[currentToken].line, scopeTree.cur.scope);
		
		// Checks and consumes the required first character of IfStatement
		if (matchToken(tokens[currentToken].kind, "T_IF")) {
			consumeToken();
		}
		
		// Initialize parsing of BooleanExpr
		parseBooleanExpr();
		
		// Initialize parsing of Block
		parseBlock();
		
		// Kicks you one level up the tree
		ast.kick();
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

	function parseIntExpr() {
		// Checks the required first and second character of AdditionOp [ T_DIGIT & T_ADDITION_OP ]
		if (matchToken(tokens[currentToken].kind, "T_DIGIT") && matchToken(tokens[currentToken+1].kind, "T_ADDITION_OP")) {
			// Creates a Addition Branch
			ast.addNode("Addition", "branch", tokens[currentToken].line, scopeTree.cur.scope);
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
		
		// Creates a StringExpr leaf
		ast.addNode(fullString, "leaf", tokens[currentToken].line, scopeTree.cur.scope);
		
	}

	function parseBooleanExpr() {
		// Checks and consumes the required first character of BooleanExpr(1) [ T_OPENING_PARENTHESIS ]
		if (matchToken(tokens[currentToken].kind, "T_OPENING_PARENTHESIS")) {
			consumeToken();
			// Creates a Comparison Branch to be renamed later
			ast.addNode("Comp","branch", tokens[currentToken].line, scopeTree.cur.scope);	
			// Initialize parsing of Expr
			parseExpr();
			// Initialize parsing of BoolOp
			var branchType = parseBoolOp();
			// Rename Comparison Branch based on the return value of parseBoolOp
			ast.cur.name = branchType;
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
		
		// Kicks you one level up the tree
		ast.kick();
	}

	function parseId() {
		// Checks and consumes the required first character of Id [ T_ID ]
		if (matchToken(tokens[currentToken].kind, "T_ID")) {
			// Creates [ Id ] leaf
			ast.addNode(tokens[currentToken].value, "leaf", tokens[currentToken].line, scopeTree.cur.scope);
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

	function parseType() {
		// Checks and consumes the required first character of type [ T_VARIABLE_TYPE ]
		if (matchToken(tokens[currentToken].kind, "T_VARIABLE_TYPE")) {
			// Creates [ type ] leaf
			ast.addNode(tokens[currentToken].value, "leaf", tokens[currentToken].line, scopeTree.cur.scope);
			consumeToken();
		}
	}

	function parseDigit() {
		// Checks and consumes the required character to be a digit [ T_DIGIT ]
		if (matchToken(tokens[currentToken].kind, "T_DIGIT")) {
			// Creates a Digit leaf
			ast.addNode(tokens[currentToken].value, "leaf", tokens[currentToken].line, scopeTree.cur.scope);
			consumeToken();
		}
	}
	
	function parseBoolOp() {
		branchType = "";
		// Checks and consumes the first possible character of BoolOp [ T_EQUALITY_OP ]
		if (matchToken(tokens[currentToken].kind, "T_EQUALITY_OP")) {
			consumeToken();
			branchType = "Equality";
		}
		// Checks and consumes the second possible character of BoolOp [ T_EQUALITY_OP ]
		else if (matchToken(tokens[currentToken].kind, "T_INEQUALITY_OP")) {
			consumeToken();
			branchType = "Inequality";
		}

		return branchType;
	}
	
	function parseBoolVal() {
		// Checks and consumes the first required character of BoolOp [ T_BOOLEAN_VALUE ]
		if (matchToken(tokens[currentToken].kind, "T_BOOLEAN_VALUE")) {
			// Creates a BoolVal leaf
			ast.addNode(tokens[currentToken].value, "branch", tokens[currentToken].line, scopeTree.cur.scope);
			consumeToken();
		}
	}
	
	function parseIntOp() {
		// Checks and consumes the required character of IntOp [ T_ADDITION_OP ]
		if (matchToken(tokens[currentToken].kind, "T_ADDITION_OP")) {
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
}