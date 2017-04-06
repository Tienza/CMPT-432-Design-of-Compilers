function makeSymbolTable() {
	var makeASTReturns = makeAST();

	var ast = makeASTReturns.AST;

	if (verbose)
		console.log(makeASTReturns);

	console.log(ast.cur);
	traverseTree(ast.cur);

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