function makeAST() {
	var parseReturns = parse();
	
	// Creates local copy of TokenArray for processing to make AST
	var tokenArray = parseReturns.tokenArray;
}