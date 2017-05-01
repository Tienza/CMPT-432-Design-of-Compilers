function codeGeneration() {
	var semanticAnalysisReturns = semanticAnalysis();

	if (verbose)
		console.log(semanticAnalysisReturns);

	// Creates local copies of Semantic Analysis Returns to be operated on
	var ast = semanticAnalysisReturns.AST;
	var st = semanticAnalysisReturns.ST;
	var tokens = semanticAnalysisReturns.tokenArray;
	var symbols = semanticAnalysisReturns.symbolArray;

	// Initialize Code Generation Error and Warning Counts
	var cgErrorCount = 0;
	var cgWarningCount = 0;
	
	// Initialize Console Variables
	var txt = $('#log').val();
	txt = $('#log').val(txt + "Beginning Code Generation Session...\n\n");
	txt = $('#log').val();

	// Initialize Code Generation Variables
	var codeTable = [];
	var maxByteSize = 256;
	var curMemLoc = maxByteSize - 1;
	var tempVarMemRef;
	var tempVarMemRef2;
	var depth = 0;

	/********************************************** Code Gen - 6502a Instructions **********************************************/
	var loadAccWithConst = "A9"; /* LDA - Load the accumulator with a constant */
	var loadAccFromMemo  = "AD"; /* LDA - Load the accumulator from memory */
	var storeAccInMemo   = "8D"; /* STA - Store the accumulator in memory */
	var addWithCarry     = "6D"; /* ADC - Adds contents of an address to the accumulator and 
										  keeps the result in the accumulator */
	var loadXWithConst   = "A2"; /* LDX - Load the X register with a constant */
	var loadXFromMemo    = "AE"; /* LDX - Load the X register from memory */
	var loadYWithConst   = "A0"; /* LDY - Load the Y register with a constant */
	var loadYFromMemo    = "AC"; /* LDY - Load the Y register from memory */
	var noOperation      = "EA"; /* NOP - No Operation */
	var breakOp          = "00"; /* BRK - Break (which is really a system call) */
	var compareMemoToX   = "EC"; /* CPX - Compare a byte in memory to the X register. Sets the Z 
										  (zero) flag if equal */
	var branch           = "D0"; /* BNE - Branch n bytes if z flag = 0 */
	var increment        = "EE"; /* INC - Increment the value of a byte */
	var systemCall       = "FF"; /* SYS - System Call
										  #$01 in X reg = print the integer stored in the Y 
										  register.
										  #$02 in X reg = print the 00-terminated string stored 
										  at the address in the Y register */

	// Begin Code Generation
	generate();

	// Code Generation Succeeded - Determines how code generation went and updates appropriate fields
	if (cgErrorCount == 0) {
		// Code Generation Success
		codeComplete = true;
		
		// Updates Progess Status Bar
		if (cgWarningCount == 0) 
			$('#cgResults').html("<span style=\"color:green;\"> PASSED </span>");
		else
			$('#cgResults').html("<span style=\"color:#d58512;\"> PASSED </span>");
		// Prints Last Semantic Analysis Message
		printLastCGMessage(codeComplete);
	}
	// Code Generation Failed
		/* See throwError Section of Code */

	/********************************************** Code Gen - Traversing AST *************************************************/
	function generate() {
		for (var i = 0; i < maxByteSize; i++) {
			codeTable.push(breakOp);
		}

		traverseTree(ast.root);

		console.log(codeTable);
	}

	function traverseTree(node) {
 		if (node.children.length != 0) {
 			node.children.forEach(function(element) {
 				printFoundBranch(element.name,element.line,element.scope);
 				traverseTree(element);
 			});
 		}
 	}

	/************************************************ Message Printing Section ************************************************/
	function printFoundBranch(branchName, lineNum, scopeNum) {
		notBranches = ["Root","Program"];
		branches = ["Block","PrintStatement","AssignmentStatement","VariableDeclaration","WhileStatement","IfStatement","Addition","Equality","Inequality"];
		if (!notBranches.includes(branchName) && branches.includes(branchName))
			txt = txt + " C.GEN --> | Found! [ " + branchName + " ] Branch on line " + lineNum + " in scope " + scopeNum + " ...\n";
	}

	function printLastCGMessage(codeComplete) {
		if (codeComplete) {
			txt = $('#log').val(txt + "\nCode Generation Completed With " + cgWarningCount + " WARNING(S) and " + cgErrorCount + " ERROR(S)" + "...\n_______________________________________________________________\n\n");
		}
		
		else {
			txt = $('#log').val(txt + "\nCode Generation Failed With " + cgWarningCount + " WARNING(S) and " + cgErrorCount + " ERROR(S)" + "...");
		}
		
		scrollDown();
	}

	/************************************************* Error Printing Section *************************************************/
	function throwCodeGenError(reason) {
		cgErrorCount++;
		printLastCGMessage(codeComplete);
		txt = txt + " S.ANALYZE --> | ERROR! " + reason;
		// Updates Progess Status Bar
		$('#cgResults').html("<span style=\"color:red;\"> FAILED </span>");
		throw new Error("HOLY SHIT! IT DIED..." + reason);
	}
}