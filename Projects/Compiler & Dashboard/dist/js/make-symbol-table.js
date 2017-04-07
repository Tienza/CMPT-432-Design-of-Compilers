function makeSymbolTable() {
	var makeASTReturns = makeAST();

	// Initialize AST Variables to be used to make symbol tables
	var ast = makeASTReturns.AST;
	var st = new symbolTable();
	
	st.addHashTable("Scope 0", "branch");

	if (verbose)
		console.log(makeASTReturns);

	traverseTree(ast.cur);
	
	console.log(values);

	function traverseTree(node) {
		if (node.children.length != 0) {
			var printed = 0;
			node.children.forEach(function(element){
				if (printed == 0) {		
					console.log(node.name);
					printed = 1;
				}
				traverseTree(element);
			});
			
		}
		else {
			console.log("Reached End of Branch... " + node.name + " on line " + node.line);
		}
	}
}