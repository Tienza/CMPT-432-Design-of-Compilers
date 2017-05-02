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
	var lhs = false;
	var rhs = false;
	var codeTable = [];
	var staticTable = [];
	var maxByteSize = 256;
	var curMemLoc = maxByteSize - 1;
	var varType = "";
	var varKey = "";
	var varTempAddr = "";
	var depth = 0;
	var varLocHead = "T";
	var varLocNum = -1;

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
	/*console.log(toHex("t"));
	console.log(toHex("there is no spoon"));
	console.log(toHex(5));*/

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
		traverseTree(ast.root);

		console.log(codeTable);
		console.log(staticTable);
	}

	function traverseTree(node) {
 		if (node.children.length != 0) {
 			node.children.forEach(function(element) {
 				printFoundBranch(element.name,element.line,element.scope);
 				// Initialize Code Gen process for Block
 				if (element.name == "Block") {

 				}
 				// Initialize Code Gen process for Variable Declaration
 				else if (element.name == "VariableDeclaration") {
 					codeTable.push(loadAccWithConst);
 					printPushHex(loadAccWithConst);
 					codeTable.push("00");
 					printPushHex("00");
 					varLocNum++;
 				}
 				// Initialize Code Gen process for Assignment Statement
 				else if (element.name == "AssignmentStatement") {
 					//codeTable.push(loadAccWithConst);
 					lhs = true;
 				}
 				traverseTree(element);
 			});
 		}
 		// Separates Leaf Nodes for easier management
 		else {
 			printFoundLeaf(node.name,node.line,node.scope);
 			// Generate Code for Variable Declaration Statements
 			if (node.parent.name == "VariableDeclaration" && /^[a-z]$/.test(node.name)) {
 				var tempName = varLocHead+varLocNum;
 				var tempLoc = "XX";
 				var tempAddr = 0;
 				if (staticTable.length != 0)
 					tempAddr = staticTable[staticTable.length-1].address + 1;
 				var elem = new tempVarElem(tempName+tempLoc,node.name,tempAddr);
 				staticTable.push(elem);
 				printPushStaticTable(elem.varKey);
 				codeTable.push(storeAccInMemo);
 				printPushHex(storeAccInMemo);
 				codeTable.push(tempName);
 				printPushHex(tempName);
 				codeTable.push(tempLoc);
 				printPushHex(tempLoc);
 			}
 			// Generates Code for Print Statements
 			else if (node.parent.name == "PrintStatement") {
 				// Checks to see if value to be printed is a variable
 				if (node.type == "T_ID") {
 					
 				}
 			}
 			// Generates Code for Assignment Statements - Int and Bool
 			else if (node.parent.name == "AssignmentStatement") {
 				// Checks to see whether leaf node is a variable
 				if (/^[a-z]$/.test(node.name)) {
 					// Checks to see if the variable is on the left side
 					if (lhs == true && rhs == false) {
 						varKey = node.name;
 						lhs = false;
 						rhs = true;
 						console.log("Assigning to variable " + node.name);
 						printAssignLeaf(varKey,node.line,"");
 						console.log(lhs);
 						console.log(rhs);
 					}
 					// Checks to see if the variable is on the right side
 					else if (lhs == false && rhs == true) {
 						var tempAddrRHS = "";
 						var tempAddrLHS = "";
	 					for (var i = 0; i < staticTable.length; i++) {
	 						if (node.name == staticTable[i].getVarKey()) {
	 							tempAddrRHS = staticTable[i].getTempLoc();
	 							break;
	 						}
	 					}
	 					for (var i = 0; i < staticTable.length; i++) {
	 						if (varKey == staticTable[i].getVarKey()) {
	 							tempAddrLHS = staticTable[i].getTempLoc();
	 							break;
	 						}
	 					}
	 					tempAddrRHS = chunk(tempAddrRHS,2);
	 					tempAddrLHS = chunk(tempAddrLHS,2);
 						codeTable.push(loadAccFromMemo);
 						printPushHex(loadAccWithConst);
	 					codeTable.push(tempAddrRHS[0]);
	 					printPushHex(tempAddrRHS[0]);
	 					codeTable.push(tempAddrRHS[1]);
	 					printPushHex(tempAddrRHS[1]);
	 					codeTable.push(storeAccInMemo);
	 					printPushHex(storeAccInMemo);
	 					codeTable.push(tempAddrLHS[0]);
	 					printPushHex(tempAddrLHS[0]);
	 					codeTable.push(tempAddrLHS[1]);
	 					printPushHex(tempAddrLHS[1]);
	 					lhs = false;
	 					rhs = false;
	 					console.log("Assigning " + node.name + " to variable " + varKey);
	 					printAssignLeaf(varKey,node.line,node.name);
 						console.log(lhs);
 						console.log(rhs);
 					}
 				}
 				// Checks to see if leaf node is a Boolean
 				else if (/^true|false$/.test(node.name) && lhs == false && rhs == true) {
 					var tempAddr = "";
 					for (var i = 0; i < staticTable.length; i++) {
 						if (varKey == staticTable[i].getVarKey()) {
 							tempAddr = staticTable[i].getTempLoc();
 							break;
 						}
 					}
 					var booleanVal = "";
 					// Checks if boolean value is true or false
 					if (/^true$/.test(node.name))
 						booleanVal = "01";
 					else
 						booleanVal = "00";
 					tempAddr = chunk(tempAddr,2);
 					codeTable.push(loadAccWithConst);
 					printPushHex(loadAccWithConst);
 					codeTable.push(booleanVal);
 					printPushHex(booleanVal);
 					codeTable.push(storeAccInMemo);
 					printPushHex(storeAccInMemo);
 					codeTable.push(tempAddr[0]);
 					printPushHex(tempAddr[0]);
 					codeTable.push(tempAddr[1]);
 					printPushHex(tempAddr[1]);
 					lhs = false;
 					rhs = false;
 					console.log("Assigning " + booleanVal + " to variable " + varKey);
 					printAssignLeaf(varKey,node.line,booleanVal);
					console.log(lhs);
					console.log(rhs);

 				}
 				// Checks to see if leaf node is an Int
 				else if (/^[0-9]$/.test(node.name) && lhs == false && rhs == true) {
 					var tempAddr = "";
 					for (var i = 0; i < staticTable.length; i++) {
 						if (varKey == staticTable[i].getVarKey()) {
 							tempAddr = staticTable[i].getTempLoc();
 							break;
 						}
 					}
 					var hexConst = "0" + node.name;
 					tempAddr = chunk(tempAddr,2);
 					codeTable.push(loadAccWithConst);
 					printPushHex(loadAccWithConst);
 					codeTable.push(hexConst);
 					printPushHex(hexConst);
 					codeTable.push(storeAccInMemo);
 					printPushHex(storeAccInMemo);
 					codeTable.push(tempAddr[0]);
 					printPushHex(tempAddr[0]);
 					codeTable.push(tempAddr[1]);
 					printPushHex(tempAddr[1]);
 					lhs = false;
 					rhs = false;
 					console.log("Assigning " + hexConst + " to variable " + varKey);
 					printAssignLeaf(varKey,node.line,hexConst);
					console.log(lhs);
					console.log(rhs);
 				}
 			}
 		}
 	}

 	function toHex(val) {
		var hex = '';
		for(var i = 0; i < val.length; i++) {
			hex += '' + val.charCodeAt(i).toString(16).toUpperCase();
		}
		return hex;
	}

	function chunk(str, n) {
		var ret = [];
		for(i = 0; i < str.length; i += n) {
	    	ret.push(str.substr(i, n))
	    }
		return ret
	}

	/************************************************ Message Printing Section ************************************************/
	function printFoundBranch(branchName, lineNum, scopeNum) {
		notBranches = ["Root","Program"];
		branches = ["Block","PrintStatement","AssignmentStatement","VariableDeclaration","WhileStatement","IfStatement","Addition","Equality","Inequality"];
		if (!notBranches.includes(branchName) && branches.includes(branchName))
			txt = txt + " C.GEN --> | Found! [ " + branchName + " ] Branch on line " + lineNum + " in scope " + scopeNum + "...\n";
	}

	function printFoundLeaf(leafName, lineNum, scopeNum) {
		txt = txt + " C.GEN --> | Found! [ " + leafName + " ] Leaf on line " + lineNum + " in scope " + scopeNum + "...\n";
	}

	function printPushHex(hexCode) {
		txt = txt + " C.GEN --> | Pushing [ " + hexCode + " ] byte to memory...\n";
	}

	function printPushStaticTable(elem) {
		txt = txt + " C.GEN --> | Pushing [ " + elem + " ] to Static Table...\n";
	}

	function printAssignLeaf(varKey, lineNum, value) {
		if (value == "")
			txt = txt + " C.GEN --> | Variable [ " + varKey + " ] on line " + lineNum + " is being assigned a value...\n";
		else
			txt = txt + " C.GEN --> | Variable [ " + varKey + " ] on line " + lineNum + " is assigned [ " + value + " ]...\n";
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