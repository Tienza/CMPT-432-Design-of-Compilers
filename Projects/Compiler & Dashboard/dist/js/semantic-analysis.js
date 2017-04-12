function semanticAnalysis() {
	var makeSymbolTableReturns = makeSymbolTable();
	
	// Initialize variables to be used in Semantic Analysis
	var ast = makeSymbolTableReturns.AST;
	var st = makeSymbolTableReturns.ST;
	var symbolArray = makeSymbolTableReturns.symbolArray;
	
	// Initialize Semantic Analysis Warning and Error Counts
	var saErrorCount = 0;
	var saWarningCount = 0;
	
	//traverseTree(st.cur);
	
	function traverseTree(node) {
		node.symbols.forEach(function(symbol) {
			console.log(symbol.type + " " + symbol.key + " in scope " + symbol.scope);
		});
		if (node.children.length != 0) {
			node.children.forEach(function(element) {
				traverseTree(element);
			});
		}
		else {
			console.log("Reached Leaf Node...");
		}
	}
}