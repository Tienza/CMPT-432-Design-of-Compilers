function codeGeneration() {
	var semanticAnalysisReturns = semanticAnalysis();

	/*if (verbose)
		// console.log(semanticAnalysisReturns);*/

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
	var staticTable = [];
	var stringTable = [];
	var jumpTable = [];
	var maxByteSize = 256;
    var trueFalseHex = ["66", "61", "6C", "73", "65", "00", "74", "72", "75", "65", "00"];
	var varKeyScope = 0;
	var varTempAddr = "";
	var depth = 0;
	var varLocHead = "T";
	var varLocNum = -1;
	var jumpHead = "J";
	var jumpNum = -1;
	var stringHead = "S";
	var stringNum = -1;
    var booleanHead = "B";
    var booleanNum = -1;
    var intHead = "I"
    var intNum = -1;
    var addHead = "A";
    var addNum = -1;
	var printStringCalled = 0;
	var calledFromBoolExpr = false;
	var calledFromAssign = false;

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
	var branchNBytes     = "D0"; /* BNE - Branch n bytes if z flag = 0 */
	var increment        = "EE"; /* INC - Increment the value of a byte */
	var systemCall       = "FF"; /* SYS - System Call
										  #$01 in X reg = print the integer stored in the Y 
										  register.
										  #$02 in X reg = print the 00-terminated string stored 
										  at the address in the Y register */

	// Begin Code Generation
	var code = generate();

	for (var i = 0; i < codeTable.length; i++) {
		if (code[1][i] == "un" || codeTable[i] == "de")
			throwCodeGenError("Variable Memory Overflow. Please Reduce String Lengths or Number of Variables...\n");	
	}

	var codeGenerationReturns = {
		codeString: code[0],
		codeArray: code[1],
		totalWarningCount:  cgWarningCount + semanticAnalysisReturns.totalWarningCount,
		totalErrorCount: cgErrorCount + semanticAnalysisReturns.totalErrorCount
	}

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

	// Break Teeth
	if (semanticComplete)
		brokenTeeth(0);

	return codeGenerationReturns;

	/********************************************** Code Gen - Traversing AST *************************************************/
	function generate() {
		traverseTree(ast.root, 0);
		pushHex(breakOp);
        var trueStringLoc = hexTable[codeTable.length+6];
        var falseStringLoc = hexTable[codeTable.length];
        // console.log("True String Location: " + trueStringLoc);
        // console.log("False String Location: " + falseStringLoc);
        pushBooleanString(trueFalseHex);
		var fullSymbolTable = getFullSymbolTable(st.root);
		fullSymbolTable = flattenStaticTable(fullSymbolTable);
		// console.log(codeTable);
		// console.log(fullSymbolTable);
        backPatchBooleanVal(codeTable, fullSymbolTable, trueStringLoc, falseStringLoc);
		backPatchStringVal(codeTable, fullSymbolTable);
		backPatchStatVal(codeTable, fullSymbolTable);
		backPatchJumpVal(codeTable, jumpTable);
		if (codeTable.length > maxByteSize)
			throwCodeGenError("Memory Exceeded 256 Bytes, Giving Up Now...\n");
		for (var i = codeTable.length; i < maxByteSize; i++) {
			codeTable.push("00");
		}
		// console.log(codeTable);
		// console.log(fullSymbolTable);
		// console.log(jumpTable);
		var code = "";
		for (var i = 0; i < codeTable.length; i++) {
			code = code + codeTable[i] + " ";
		}

		return [code, codeTable];
	}

	function traverseTree(node, depth) {
        // Space out based on the current depth so
        // this looks at least a little tree-like.
        for (var i = 0; i < depth; i++) {
        }

        // If there are no children (i.e., leaf nodes)...
        if (!node.children || node.children.length === 0) {
        	// console.log(node.name + " at depth " + depth);

        } 
        // See what's kind of node we are currently on and decides which function to call
		else {
			// console.log(node.name + " at depth " + depth);
			if (node.name == "Root")
				rootCodeGen(node.children, depth);
			else if (node.name == "Program")
				programCodeGen(node.children, depth);
			else if (node.name == "Block")
				blockCodeGen(node.children, depth);
			else if (node.name == "VariableDeclaration")
				varDeclCodeGen(node, depth);
			else if (node.name == "AssignmentStatement")
				assignStateCodeGen(node, depth);
			else if (node.name == "PrintStatement")
				printStateCodeGen(node, depth);
			else if (node.name == "IfStatement")
				ifStateCodeGen(node, depth);
			else if (node.name == "WhileStatement")
				whileStateCodeGen(node, depth);
			else if (node.name == "Addition") {
				var lastMemLoc = additionCodeGen(node, depth);
				return lastMemLoc;
			}
			else {
				// console.log("I got here...");
				for (var i = 0; i < node.children.length; i++) {
                	traverseTree(node.children[i], depth + 1);
            	}
			}
        }

        function rootCodeGen(node, depth) {
        	// Continues the traversal
        	// console.log("Generating Code For Root");
        	for (var i = 0; i < node.length; i++) {
                traverseTree(node[i], depth + 1);
            }
            // console.log("Root Finished codeTableLoc: " + codeTable.length);

            return codeTable.length;
        }

        function programCodeGen(node, depth) {
        	// Continues the traversal
        	// console.log("Generating Code For Program");
        	for (var i = 0; i < node.length; i++) {
                traverseTree(node[i], depth + 1);
            }
            // console.log("Program Finished codeTableLoc: " + codeTable.length);

            return codeTable.length;
        }

        function blockCodeGen(node, depth) {
        	// Continues the traversal
        	if (verbose) {
        		printFoundBranch(node.name, node.line, node.scope);
        		// console.log("Generating Code For Block");
        	}

        	var startBlock = codeTable.length;
            for (var i = 0; i < node.length; i++) {
                traverseTree(node[i], depth + 1);
            }
            var endBlock = codeTable.length;
            var hexGenNum = endBlock - startBlock;
            // console.log("Block Finished codeTableLoc: " + codeTable.length);
        	// console.log("Block Finished Hex Generated: " + hexGenNum);

            return codeTable.length;
        }

        function additionCodeGen(node, depth) {
        	addNum++;
        	// Generates code for Addition
        	if (verbose) {
        		printFoundBranch(node.name, node.line, node.scope);
        		// console.log("Generating Code For Addition");
        	}

        	var startAddition = codeTable.length;
        	var endAddition = 0;
        	var hexGenNum = 0;
        	// Assigns the nodes to local variables
        	var digitNode = node.children[0];
        	var intExprNode = node.children[1];

        	// Var Addition Branch Temporary Location
        	var lastTempLoc = "";

        	// If the right addition is an Addition then we need to perform that first
			if (intExprNode.type == "Addition") {
				varLocNum++;
				var compInt = "0" + intExprNode.name;
				var scope = getScope(intExprNode.scope);
				var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
				lastTempLoc = tempLoc;
				var numSymbol = new Symbol(addHead+addNum+intExprNode.name, "int", intExprNode.line, intExprNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, tempLoc+"XX");
				scope.symbols.push(numSymbol);

				traverseTree(intExprNode, depth);

				pushHex(tempLoc);
				pushHex("XX");
			}
        	// If the right comparator is a digit we need to store it in memory
			else if (intExprNode.type == "T_DIGIT") {
				varLocNum++;
				var compInt = "0" + intExprNode.name;
				var scope = getScope(intExprNode.scope);
				var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
				var numSymbol = new Symbol(addHead+addNum+intExprNode.name, "int", intExprNode.line, intExprNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, tempLoc+"XX");
				scope.symbols.push(numSymbol);

				pushHex(loadAccWithConst);
				pushHex(compInt);
				pushHex(storeAccInMemo);
				pushHex(tempLoc);
				pushHex("XX");
			}

        	// Stores the digit in the accumulator
        	var assignVal = "0" + digitNode.name;

        	pushHex(loadAccWithConst);
        	pushHex(assignVal);
        	pushHex(addWithCarry);

        	// Checks if right addition is an id or digit
	    	if (intExprNode.type == "T_DIGIT") {
	    		var tempLoc = getTempLoc(addHead+addNum+intExprNode.name, intExprNode.scope);
	    		lastTempLoc = tempLoc[0];

	    		pushHex(tempLoc[0]);
	    		pushHex(tempLoc[1]);

	    	}
	    	else if (intExprNode.type == "T_ID") {
	    		if (calledFromAssign == true) {
		    		var tempLoc = getTempLoc(intExprNode.name, intExprNode.scope);
		    		lastTempLoc = tempLoc[0];

		    		pushHex(tempLoc[0]);
		    		pushHex(tempLoc[1]);
	    		}
	    		else if (calledFromBoolExpr == true) {
	    			varLocNum++;
					var scope = getScope(intExprNode.scope);
					var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
					lastTempLoc = tempLoc;
					var numSymbol = new Symbol(addHead+addNum+intExprNode.name, "int", intExprNode.line, intExprNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, tempLoc+"XX");
					scope.symbols.push(numSymbol);

					var tempLoc = getTempLoc(intExprNode.name, intExprNode.scope);

		    		pushHex(tempLoc[0]);
		    		pushHex(tempLoc[1]);
	    		}

	    	}
	    	// If right addition was an AdditionExpr - then assign memory location of previous result
	    	else {
	    		pushHex(lastTempLoc);
	    		pushHex("XX");
	    	}

	    	pushHex(storeAccInMemo);

	    	endAddition = codeTable.length;
	    	hexGenNum = endAddition - startAddition;

			// console.log("Addition Finished codeTableLoc: " + codeTable.length);
        	// console.log("Addition Finished Hex Generated: " + hexGenNum);

	    	return lastTempLoc;
        }

        function varDeclCodeGen(node, depth) {
        	// Generates code for Varaible Declarations
        	if (verbose) {
        		printFoundBranch(node.name, node.line, node.scope);
        		// console.log("Generating Code For VariableDeclaration");
        	}

        	varLocNum++;
        	var startVarDecl = codeTable.length;
        	var endVarDecl = 0;
        	var hexGenNum = 0;
        	// Assigns the nodes to local variables
        	var typeNode = node.children[0];
        	var varKeyNode = node.children[1];
        	// Checks to see if the variable is an int or boolean
        	if (typeNode.name == "int") {
        		pushHex(loadAccWithConst);
        		pushHex("00");
    			pushHex(storeAccInMemo);
    			// Creates the Temporary Location Reference Name
    			var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
    			pushHex(tempLoc);
    			pushHex("XX");
    			// Assigns The Temporary Location Name to the appropriate symbol in the symbol table
    			assignTempLoc(varKeyNode.name, node.scope, tempLoc+"XX");
    	   }
            else if  (typeNode.name == "boolean") {
                booleanNum++;
                pushHex(loadAccWithConst);
                pushHex("00");
                pushHex(storeAccInMemo);
                var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
                pushHex(tempLoc);
                pushHex("XX");

                // Assings the Temporary Loc and Store Name to the appropriate symbol in the symbol table
                assignTempLoc(varKeyNode.name, node.scope, tempLoc+"XX");
                //assignTempStore(varKeyNode.name, node.scope, tempLoc+"XX");
            }
            else if (typeNode.name == "string") {
                stringNum++;
                pushHex(loadAccWithConst);
                pushHex("00");
                pushHex(storeAccInMemo);
                var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
                pushHex(tempLoc);
                pushHex("XX");
                // Assings the Temporary Loc and Store Name to the appropriate symbol in the symbol table
                assignTempLoc(varKeyNode.name, node.scope, stringHead+stringNum+"XX");
                assignTempStore(varKeyNode.name, node.scope, tempLoc+"XX");
            }

    		endVarDecl = codeTable.length;
    		hexGenNum = endVarDecl - startVarDecl;

        	// console.log("VariableDeclaration Finished codeTableLoc: " + codeTable.length);
        	// console.log("VariableDeclaration Finished Hex Generated: " + hexGenNum);

        	return hexGenNum;
        }

        function assignStateCodeGen(node, depth) {
        	if (verbose) {
        		printFoundBranch(node.name, node.line, node.scope);
        		// console.log("Generating Code For AssignmentStatement");
        	}

        	var startAssign = codeTable.length;
        	var endAssign = 0;
        	var hexGenNum = 0;
        	// Assigns the nodes to local vairables
        	var varKeyNode = node.children[0];
        	var assignValNode = node.children[1];
        	// Checks to see if the assigning value is an int or not
        	if (assignValNode.type == "T_DIGIT") {
        		// console.log(varKeyNode.name);
        		// console.log(varKeyNode.scope);
        		//var tempLoc = getStaticTableLoc(varKeyNode.name,varKeyNode.scope);
        		var tempLoc = getTempLoc(varKeyNode.name, varKeyNode.scope);
        		var assignVal = "0" + assignValNode.name;
        		if (verbose)
        			printAssignLeaf(varKeyNode.name, varKeyNode.line, assignVal);

        		pushHex(loadAccWithConst);
        		pushHex(assignVal);
        		pushHex(storeAccInMemo);
        		pushHex(tempLoc[0]);
        		pushHex(tempLoc[1]);
        	}
        	// Checks to see if the assigning value is a boolean or not
        	else if (assignValNode.type == "T_BOOLEAN_VALUE") {
        		// console.log(varKeyNode.name);
        		// console.log(varKeyNode.scope);
        		// Gets the Temporary Location of the variable being assigned
        		var tempLoc = getTempLoc(varKeyNode.name, varKeyNode.scope);
        		var assignVal = "";
        		if (assignValNode.name == "true")
        			assignVal = "01";
        		else
        			assignVal = "00";

        		if (verbose)
        			printAssignLeaf(varKeyNode.name, varKeyNode.line, assignVal);

        		pushHex(loadAccWithConst);
        		pushHex(assignVal);
        		pushHex(storeAccInMemo);
        		pushHex(tempLoc[0]);
        		pushHex(tempLoc[1]);
        	}
        	// Checks to see if the assigning value is an id
        	else if (assignValNode.type == "T_ID") {
        		// console.log(varKeyNode.name);
        		// console.log(varKeyNode.scope);
        		// Gets the Temporary Location of both the variable being assigned and the assigning varaible
        		if (verbose)
        			printAssignLeaf(varKeyNode.name, varKeyNode.line, assignValNode.name);

        		var tempLocVar = "";
        		var tempLocVal = "";

        		var varScope = getScope(varKeyNode.scope);
        		var varType = getVarType(varScope, varKeyNode.name);

        		var assignValScope = getScope(assignValNode.scope);
        		var assignValType = getVarType(assignValScope, assignValNode.name);

        		// console.log(varType);
        		// console.log(assignValType);

        		if (varType == "string" && assignValType == "string") {
        			tempLocVar = getTempStore(varKeyNode.name, varKeyNode.scope);
        			tempLocVal = getTempStore(assignValNode.name, assignValNode.scope);
        		}

        		else {
        			tempLocVar = getTempLoc(varKeyNode.name, varKeyNode.scope);
        			tempLocVal = getTempLoc(assignValNode.name, assignValNode.scope);
        		}

        		pushHex(loadAccFromMemo);
        		pushHex(tempLocVal[0]);
        		pushHex(tempLocVal[1]);
        		pushHex(storeAccInMemo);
        		pushHex(tempLocVar[0]);
        		pushHex(tempLocVar[1]);
        	}
            // Check to see if the assigning value is a string
            else if (assignValNode.type == "T_CHARLIST") {
            	stringNum++;
	    		varLocNum++;
                // console.log(varKeyNode.name);
                // console.log(varKeyNode.scope);

                var stringHex = toHex(assignValNode.name);
                stringHex.push("00");
                var scope = getScope(varKeyNode.scope);
                // console.log(stringHex);
                //assignHexVal(scope, varKeyNode.name, stringHex);

	    		var scope = getScope(assignValNode.scope);
	    		// console.log(stringHex);
	    		var elem = new Symbol("string"+stringNum, "string", assignValNode.line, assignValNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, stringHead+stringNum+"XX", stringHex, varLocHead+varLocNumtoHex(varLocNum)+"XX");
	    		scope.symbols.push(elem);
	    		
                // Gets the Temporary Location of the variable being assigned   
                var tempVarStore = getTempStore(varKeyNode.name, varKeyNode.scope);
             	var tempLoc = getTempLoc("string"+stringNum, assignValNode.scope);
                //var tempStoreVal = getTempStore(varKeyNode.name, varKeyNode.scope);

                if (verbose)
                    printAssignLeaf(varKeyNode.name, varKeyNode.line, assignValNode.name);
                //alert(tempLoc[0] + " " + tempLocVar[0] + " " + tempStore[0]);
                pushHex(loadAccWithConst);
                pushHex(tempLoc[0]);
                pushHex(storeAccInMemo);
                pushHex(tempVarStore[0]);
                pushHex(tempVarStore[1]);
            }
            // Checks to see if the assigning value is an Addition
            else if (assignValNode.type == "Addition") {
            	// console.log(varKeyNode.name);
                // console.log(varKeyNode.scope);

                // Entering Addition Called From Assign
                calledFromAssign = true;
                // Traverse Tree for Addition
                traverseTree(assignValNode, depth);
                // Exiting Addition Called From Assign
                calledFromAssign = false;
                
				// Store the results in the memory location of the variable being assigned
				var tempLocVar = getTempLoc(varKeyNode.name, varKeyNode.scope)

				if (verbose)
					printAssignLeaf(varKeyNode.name, varKeyNode.line, assignValNode.name);

				pushHex(tempLocVar[0]);
				pushHex(tempLocVar[1]);
            }
            // Checks to see if the assinging value is an Equality
            else if (assignValNode.type == "Equality") {
            	if ((assignValNode.children[0].type == "T_DIGIT" && assignValNode.children[1].type == "T_DIGIT") || (assignValNode.children[0].type == "T_CHARLIST" && assignValNode.children[1].type == "T_CHARLIST") || (assignValNode.children[0].type == "T_BOOLEAN_VALUE" && assignValNode.children[1].type == "T_BOOLEAN_VALUE")) {
	    			var compBool = "";
	    			if (assignValNode.children[0].name == assignValNode.children[1].name)
	    				compBool = "01";
	    			else
	    				compBool = "00";

	    			// Store the results in the memory location of the variable being assigned
					var tempLocVar = getTempLoc(varKeyNode.name, varKeyNode.scope)

					if (verbose)
						printAssignLeaf(varKeyNode.name, varKeyNode.line, assignValNode.name);

		    		pushHex(loadAccWithConst);
		    		pushHex(compBool);
		    		pushHex(storeAccInMemo);
		    		pushHex(tempLocVar[0]);
					pushHex(tempLocVar[1]);
	    		}
            }
            // Checks to see if the assinging value is an Equality
            else if (assignValNode.type == "Inequality") {
            	if ((assignValNode.children[0].type == "T_DIGIT" && assignValNode.children[1].type == "T_DIGIT") || (assignValNode.children[0].type == "T_CHARLIST" && assignValNode.children[1].type == "T_CHARLIST") || (assignValNode.children[0].type == "T_BOOLEAN_VALUE" && assignValNode.children[1].type == "T_BOOLEAN_VALUE")) {
	    			var compBool = "";
	    			if (assignValNode.children[0].name != assignValNode.children[1].name)
	    				compBool = "01";
	    			else
	    				compBool = "00";

	    			// Store the results in the memory location of the variable being assigned
					var tempLocVar = getTempLoc(varKeyNode.name, varKeyNode.scope)

					if (verbose)
						printAssignLeaf(varKeyNode.name, varKeyNode.line, assignValNode.name);

		    		pushHex(loadAccWithConst);
		    		pushHex(compBool);
		    		pushHex(storeAccInMemo);
		    		pushHex(tempLocVar[0]);
					pushHex(tempLocVar[1]);
	    		}
            }

        	endAssign = codeTable.length;
        	hexGenNum = endAssign - startAssign;

        	// console.log("AssignmentStatement Finished codeTableLoc: " + codeTable.length);
        	// console.log("AssignmentStatement Finished Hex Generated: " + hexGenNum);

        	return hexGenNum;
        }
    }

    function printStateCodeGen(node, depth) {
    	if (verbose) {
        	printFoundBranch(node.name, node.line, node.scope);
    		// console.log("Generating Code For PrintStatement");
    	}
    	var startPrint = codeTable.length;
    	var endPrint = 0;
    	var hexGenNum = 0;
    	var printNode = node.children[0];
    	// Checks to see if the value being printed is a variable or not
    	if (printNode.type == "T_ID") {
    		// console.log(printNode.name);
        	// console.log(printNode.scope);
        	// Checks to see if the value being printed in an int or bool type
        	var scope = getScope(printNode.scope);
        	var type = getVarType(scope, printNode.name);

        	// console.log("Variable [ " + printNode.name + " ] has type [ " + type + " ]");

        	if (type == "int" || type == "boolean") {
	        	// Gets the Temporary Location of the variable being printed
	        	var tempLoc = getTempLoc(printNode.name, printNode.scope);
	        	pushHex(loadYFromMemo);
	        	pushHex(tempLoc[0]);
	        	pushHex(tempLoc[1]);
	        	pushHex(loadXWithConst);
	        	pushHex("01");
        	}

            else if (type == "string") {
                var tempLoc = getTempLoc(printNode.name, printNode.scope);
                var tempStore = getTempStore(printNode.name, printNode.scope);

                pushHex(loadYFromMemo);
                pushHex(tempStore[0]);
                pushHex(tempStore[1]);
                //pushHex(storeAccInMemo);
                //pushHex(tempStore[0]);
                //pushHex(tempStore[1]);
                pushHex(loadXWithConst);
                pushHex("02");
            }
    	}
    	// Checks to see if the value being printed is an int
    	else if (printNode.type == "T_DIGIT") {
    		var printInt = "0" + printNode.name;
    		pushHex(loadYWithConst);
    		pushHex(printInt);
    		pushHex(loadXWithConst);
    		pushHex("01");
    	}
        // Checks to see if the value being printed is a boolean
        else if (printNode.type == "T_BOOLEAN_VALUE") {
            booleanNum++;
            varLocNum++;
            var boolVal = "";
            var scope = getScope(printNode.scope);
            if (printNode.name == "true")
                boolVal = "01";
            else 
                boolVal = "00";
            var elem = new Symbol("boolean"+booleanNum, "boolean", printNode.line, printNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, booleanHead+booleanNum+"XX", boolVal, varLocHead+varLocNumtoHex(varLocNum)+"XX");
            scope.symbols.push(elem);
            var tempLoc = getTempLoc("boolean"+booleanNum, printNode.scope);
            var tempStore = getTempStore("boolean"+booleanNum, printNode.scope);

            pushHex(loadAccFromMemo);
            pushHex(tempLoc[0]);
            pushHex(tempLoc[1]);
            pushHex(loadYWithConst);
            pushHex(tempLoc[0]);
            pushHex(storeAccInMemo);
            pushHex(tempStore[0]);
            pushHex(tempStore[1]);
            pushHex(loadXWithConst);
            pushHex("02");

        }
    	// Checks to see if the value being printed is a string
    	else if (printNode.type == "T_CHARLIST") {
    		stringNum++;
    		varLocNum++;
    		printStringCalled = 1;
    		var hexVal = toHex(printNode.name);
    		hexVal.push("00");
    		var scope = getScope(printNode.scope);
    		// console.log(hexVal);
    		var elem = new Symbol("string"+stringNum, "string", printNode.line, printNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, stringHead+stringNum+"XX", hexVal, varLocHead+varLocNumtoHex(varLocNum)+"XX");
    		scope.symbols.push(elem);
    		var tempLoc = getTempLoc("string"+stringNum, printNode.scope);
    		var tempStore = getTempStore("string"+stringNum, printNode.scope);

    		pushHex(loadAccFromMemo);
    		pushHex(tempLoc[0]);
    		pushHex(tempLoc[1]);
    		pushHex(loadYWithConst);
    		pushHex(tempLoc[0]);
    		pushHex(storeAccInMemo);
    		pushHex(tempStore[0]);
    		pushHex(tempStore[1]);
    		pushHex(loadXWithConst);
    		pushHex("02");
    	}
    	// Checks to see if the value being printed in an addition
    	else if (printNode.type == "Addition") {
    		// Entering Addition Called From Print Statement - Treated Like BoolExpr
    		calledFromBoolExpr = true;
    		var lastMemLoc = traverseTree(printNode, depth);
    		// Exiting Addition Called From Print Statment - Treated Like BoolExpr
    		calledFromBoolExpr = false;

    		pushHex(lastMemLoc);
    		pushHex("XX");
    		pushHex(loadYFromMemo);
    		pushHex(lastMemLoc);
    		pushHex("XX");
    		pushHex(loadXWithConst);
    		pushHex("01");
    	}
    	// Checks to see if the value being printed is a boolean expression (Equality)
    	else if (printNode.type == "Equality") {
    		if ((printNode.children[0].type == "T_DIGIT" && printNode.children[1].type == "T_DIGIT") || (printNode.children[0].type == "T_CHARLIST" && printNode.children[1].type == "T_CHARLIST") || (printNode.children[0].type == "T_BOOLEAN_VALUE" && printNode.children[1].type == "T_BOOLEAN_VALUE")) {
    			var boolLoc = "";
    			if (printNode.children[0].name == printNode.children[1].name)
    				boolLoc = "trueLoc";
    			else
    				boolLoc = "falseLoc";

	    		pushHex(loadYWithConst);
	    		pushHex(boolLoc);
	    		pushHex(loadXWithConst);
	    		pushHex("02");
    		}
    		else
    			throwCodeGenError("Boolean Hell Detected, Unwilling To Generate Code For This...\n")
    	}
    	// Checks to see if the value being printed is a boolean expression (Inequality)
    	else if (printNode.type == "Inequality") {
    		if ((printNode.children[0].type == "T_DIGIT" && printNode.children[1].type == "T_DIGIT") || (printNode.children[0].type == "T_CHARLIST" && printNode.children[1].type == "T_CHARLIST") || (printNode.children[0].type == "T_BOOLEAN_VALUE" && printNode.children[1].type == "T_BOOLEAN_VALUE")) {
    			var boolLoc = "";
    			if (printNode.children[0].name != printNode.children[1].name)
    				boolLoc = "trueLoc";
    			else
    				boolLoc = "falseLoc";

	    		pushHex(loadYWithConst);
	    		pushHex(boolLoc);
	    		pushHex(loadXWithConst);
	    		pushHex("02");
    		}
    		else
    			throwCodeGenError("Boolean Hell Detected, Unwilling To Generate Code For This...\n")
    	}


        pushHex(systemCall);

    	endPrint = codeTable.length;
    	hexGenNum = endPrint - startPrint;

    	// console.log("PrintStatement Finished codeTableLoc: " + codeTable.length);
        // console.log("PrintStatement Finished Hex Generated: " + hexGenNum);

    	return hexGenNum;
    }

    function whileStateCodeGen(node, depth) {
    	if (verbose) {
    		printFoundBranch(node.name, node.line, node.scope);
    		// console.log("Generating Code For WhileStatement");
    	}
    	jumpNum++;
    	var startWhile = codeTable.length;
    	var endWhile = 0;
    	var hexGenNum = 0;
    	var booleanExpNode = node.children[0];
    	var blockNode = node.children[1];

        if (booleanExpNode.children[0] != undefined && booleanExpNode.children[1] != undefined)
        	// Check for nested boolean expression
        	if (booleanExpNode.children[0].name == "Equality" || booleanExpNode.children[0].name == "Inequality" || booleanExpNode.children[1].name == "Equality" || booleanExpNode.children[1].name == "Inequality")
        		throwCodeGenError("Nested Boolean Expression Detected, Unwilling To Generate Code For That...\n");

    	// Push JumpVal to Jump Table
    	var jumpName = jumpHead + jumpNum;
    	var elem = new jumpVarElem(jumpName,"?");
    	jumpTable.push(elem)

    	if (booleanExpNode.name == "true" || booleanExpNode.name == "false") {
    		varLocNum++;
    		var scope = getScope(booleanExpNode.scope);
    		var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
    		var boolSymbol = new Symbol(booleanExpNode.name, "boolean", booleanExpNode.line, booleanExpNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, tempLoc+"XX");
    		scope.symbols.push(boolSymbol);

	    	pushHex(loadXWithConst);
	    	if (booleanExpNode.name == "true")
	    		pushHex("00");
	    	else
	    		pushHex("01");
			pushHex(compareMemoToX);
			pushHex(systemCall);
			pushHex("00");
    	}
    	else if (booleanExpNode.name == "Equality") {
    		if ((booleanExpNode.children[0].type == "T_DIGIT" && booleanExpNode.children[1].type == "T_DIGIT") || (booleanExpNode.children[0].type == "T_CHARLIST" && booleanExpNode.children[1].type == "T_CHARLIST") || (booleanExpNode.children[0].type == "T_BOOLEAN_VALUE" && booleanExpNode.children[1].type == "T_BOOLEAN_VALUE")) {
    			var compBool = "";
    			if (booleanExpNode.children[0].name == booleanExpNode.children[1].name)
    				compBool = "00";
    			else
    				compBool = "01";

	    		pushHex(loadXWithConst);
	    		pushHex(compBool);
	    		pushHex(compareMemoToX);
	    		pushHex(systemCall);
	    		pushHex("00");
    		}
    		else {
    			equalityCodeGen(booleanExpNode, depth);
    		}
    	}
    	else if (booleanExpNode.name == "Inequality") {
    		if ((booleanExpNode.children[0].type == "T_DIGIT" && booleanExpNode.children[1].type == "T_DIGIT") || (booleanExpNode.children[0].type == "T_CHARLIST" && booleanExpNode.children[1].type == "T_CHARLIST") || (booleanExpNode.children[0].type == "T_BOOLEAN_VALUE" && booleanExpNode.children[1].type == "T_BOOLEAN_VALUE")) {
    			var compBool = "";
    			if (booleanExpNode.children[0].name != booleanExpNode.children[1].name)
    				compBool = "00";
    			else
    				compBool = "01";

	    		pushHex(loadXWithConst);
	    		pushHex(compBool);
	    		pushHex(compareMemoToX);
	    		pushHex(systemCall);
	    		pushHex("00");
    		}
    		else {
    			inequalityCodeGen(booleanExpNode, depth);
    		}
    	}


		pushHex(branchNBytes);
		pushHex(jumpName);

    	// Traverse Tree for Block
    	var startBlock = codeTable.length;
    	traverseTree(blockNode, depth);

    	pushHex(loadXWithConst);
    	pushHex("01");
    	pushHex(compareMemoToX);
    	pushHex(systemCall);
    	pushHex("00");
    	pushHex(branchNBytes);

    	var endBlock = codeTable.length;
    	var blockHexGenNum = endBlock - startBlock + 1;

    	// console.log("Jump Distance for Block: " + blockHexGenNum);

    	/*if (booleanExpNode.name == "true" || booleanExpNode.name == "false")
    		blockHexGenNum++;*/

    	for (var i = 0; i < jumpTable.length; i++) {
    		var hexVal = blockHexGenNum.toString(16).toUpperCase();
    		if (blockHexGenNum < 16)
    			hexVal = "0" + hexVal;

    		if (jumpTable[i].tempName == jumpName)
    			jumpTable[i].distance = hexVal;
    	}

    	var endWhile = codeTable.length;
    	var whileHexGenNum = endWhile - startWhile;

    	var whileJump = maxByteSize - whileHexGenNum - 1;
    	var whileJumpHex = whileJump.toString(16).toUpperCase();
    	if (whileJump < 16)
    		whileJumpHex = "0" + whileJumpHex;

    	pushHex(whileJumpHex);
    	
    }

    function ifStateCodeGen(node, depth) {
    	if (verbose) {
    		printFoundBranch(node.name, node.line, node.scope);
    		// console.log("Generating Code For IfStatement");
    	}
    	jumpNum++;
    	var startIf = codeTable.length;
    	var endIf = 0;
    	var hexGenNum = 0;
    	var booleanExpNode = node.children[0];
    	var blockNode = node.children[1];

        if (booleanExpNode.children[0] != undefined && booleanExpNode.children[1] != undefined)
        	// Check for nested boolean expression
        	if (booleanExpNode.children[0].name == "Equality" || booleanExpNode.children[0].name == "Inequality" || booleanExpNode.children[1].name == "Equality" || booleanExpNode.children[1].name == "Inequality")
        		throwCodeGenError("Nested Boolean Expression Detected, Fuck That...\n");

    	if (booleanExpNode.name == "Equality")
    		equalityCodeGen(booleanExpNode, depth);
    	else if (booleanExpNode.name == "Inequality")
    		inequalityCodeGen(booleanExpNode, depth);
    	else if (booleanExpNode.name == "true" || booleanExpNode.name == "false") {
    		varLocNum++;
    		var compBool = "";
    		if (booleanExpNode.name == "true")
    			compBool = "01";
    		else
    			compBool = "00";
    		var scope = getScope(booleanExpNode.scope);
    		var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
    		var boolSymbol = new Symbol(booleanExpNode.name, "boolean", booleanExpNode.line, booleanExpNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, tempLoc+"XX");
    		scope.symbols.push(boolSymbol);

    		pushHex(loadAccWithConst);
    		pushHex(compBool);
    		pushHex(storeAccInMemo);
    		pushHex(tempLoc);
    		pushHex("XX");
    		pushHex(loadXWithConst);
    		pushHex("01");
    		pushHex(compareMemoToX);
    		pushHex(tempLoc);
    		pushHex("XX");
    	}
    	
    	// Push JumpVal to Jump Table
    	var jumpName = jumpHead + jumpNum;
    	var elem = new jumpVarElem(jumpName,"?");
    	jumpTable.push(elem)

    	pushHex(branchNBytes);
    	pushHex(jumpName);

    	// Traverse Tree for Block
    	var startBlock = codeTable.length;
    	traverseTree(blockNode, depth);
    	var endBlock = codeTable.length;
    	var blockHexGenNum = endBlock - startBlock;
    	/*if (printStringCalled != 0) {
    		blockHexGenNum = blockHexGenNum + printStringCalled;
    		printStringCalled = 0;
    	}*/
    	// console.log("Jump Distance for Block: " + blockHexGenNum);

    	for (var i = 0; i < jumpTable.length; i++) {
    		var hexVal = blockHexGenNum.toString(16).toUpperCase();

    		if (blockHexGenNum < 16)
    			hexVal = "0" + hexVal;

    		if (jumpTable[i].tempName == jumpName)
    			jumpTable[i].distance = hexVal;
    	}

    	endIf = codeTable.length;
    	hexGenNum = endIf - startIf;

    	// console.log("IfStatement Finished codeTableLoc: " + codeTable.length);
        // console.log("IfStatement Finished Hex Generated: " + hexGenNum);
    }

    function inequalityCodeGen(node, depth) {
    	if (verbose) {
    		printFoundBranch(node.name, node.line, node.scope);
    		// console.log("Generating Code For Inequality");
    	}
    	var startInequality = codeTable.length;
    	var endInequality = 0;
    	var hexGenNum = 0;
    	var leftNode = node.children[0];
    	var rightNode = node.children[1];
    	var leftString = "";
    	var rightString = "";
    	var rightAddTempLoc = "";

    	if ((leftNode.type == "T_ID" && rightNode.type == "T_CHARLIST") || (leftNode.type == "T_CHARLIST" && rightNode.type == "T_ID"))
    		throwCodeGenError("Variable to String comparison is not allowed...\n")
    	else if (leftNode.type == "T_ID" && rightNode.type == "T_ID") {
    		var scopeL = getScope(leftNode.scope);
    		var typel = getVarType(scopeL, leftNode.name);

    		var scopeR = getScope(rightNode.scope);
    		var type2 = getVarType(scopeR, rightNode.name);

    		if (typel == "string" && type2 == "string")
    			throwCodeGenError("String Variable to String Variable comparison is not allowed...\n");
    	}

    	// If the right comparator is a pure digit we need to store it in memory
    	if (rightNode.type == "T_DIGIT") {
    		varLocNum++;
    		var compInt = "0" + rightNode.name;
			var scope = getScope(rightNode.scope);
			var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
			var numSymbol = new Symbol(rightNode.name, "int", rightNode.line, rightNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, tempLoc+"XX");
			scope.symbols.push(numSymbol);

    		pushHex(loadAccWithConst);
    		pushHex(compInt);
    		pushHex(storeAccInMemo);
    		pushHex(tempLoc);
    		pushHex("XX");
    	}
    	// If the right comparator is a pure boolean we need to store it in memory
    	else if (rightNode.type == "T_BOOLEAN_VALUE") {
    		varLocNum++;
    		var compBool = "";
    		if (rightNode.name == "true")
    			compBool = "01";
    		else
    			compBool = "00";
    		var scope = getScope(rightNode.scope);
    		var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
    		var boolSymbol = new Symbol(rightNode.name, "boolean", rightNode.line, rightNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, tempLoc+"XX");
    		scope.symbols.push(boolSymbol);

    		pushHex(loadAccWithConst);
    		pushHex(compBool);
    		pushHex(storeAccInMemo);
    		pushHex(tempLoc);
    		pushHex("XX");
    	}
        // Checks if the right comparator is a pure string
        else if (rightNode.type == "T_CHARLIST") {
            varLocNum++;
            rightString = rightNode.name;
            var compBool = "01";
            var scope = getScope(rightNode.scope);
            var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
            var stringSymbol = new Symbol(rightNode.name, "boolean", rightNode.line, rightNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, tempLoc+"XX")
            scope.symbols.push(stringSymbol);

            pushHex(loadAccWithConst);
            pushHex(compBool);
            pushHex(storeAccInMemo);
            pushHex(tempLoc);
            pushHex("XX");
        }
        // Checks if the right comparator is an Addition
        else if (rightNode.name == "Addition") {
        	// Entering Addition Called From Boolexpr
        	calledFromBoolExpr = true;
            // Traverse Tree for Addition Node
            rightAddTempLoc = traverseTree(rightNode, depth);
            // Exiting Addition Called From BoolExpr
            calledFromBoolExpr = false;

            pushHex(rightAddTempLoc);
            pushHex("XX");
        }

    	/* Handles Left Expression */

    	// Checks if left comparator is an id
    	if (leftNode.type == "T_ID") {
    		var varLoc1 = "";
    		var varLoc2 = "";
    		var scope = getScope(leftNode.scope);
    		var type = getVarType(scope, leftNode.name);
    		// console.log(type);

    		if (type == "string") {
    			var tempStore = getTempStore(leftNode.name, leftNode.scope);
    			varLoc1 = tempStore[0];
    			varLoc2 = tempStore[1];
    		}
    		else {
    			var tempLoc = getTempLoc(leftNode.name, leftNode.scope);
    			varLoc1 = tempLoc[0];
    			varLoc2 = tempLoc[1];
    		}

    		pushHex(loadXFromMemo);
    		pushHex(varLoc1);
    		pushHex(varLoc2);
    		pushHex(compareMemoToX);
    	}
    	// Checks if the left comparator is a pure digit
    	else if (leftNode.type == "T_DIGIT") {
    		var compInt = "0" + leftNode.name;

    		pushHex(loadXWithConst);
    		pushHex(compInt);
    		pushHex(compareMemoToX);
    	}
    	// Check if the left comparator is a pure boolean
    	else if (leftNode.type == "T_BOOLEAN_VALUE") {
    		var compBool = "";
    		if (leftNode.name == "true")
    			compBool = "01";
    		else
    			compBool = "00";

    		pushHex(loadXWithConst);
    		pushHex(compBool);
    		pushHex(compareMemoToX);
    	}
        // Checks if the left comparator is a pure string
        else if (leftNode.type == "T_CHARLIST") {
            leftString = leftNode.name;
            var compBool = "";
            // I swear this isn't cheating...
            if (leftString == rightString) {
                compBool = "01";
            }
            else
                compBool = "00";

            pushHex(loadXWithConst);
            pushHex(compBool);
            pushHex(compareMemoToX);
        }
        // Checks if the left comparator is an Addition
        else if (leftNode.name == "Addition") {
        	// Entering Addition Called From BoolExpr
        	calledFromBoolExpr = true;
            // Traverse Tree for Addition Node
            var leftAddTempLoc = traverseTree(leftNode, depth);
            // Exiting Addition Called From BoolExpr
            calledFromBoolExpr = false;

            pushHex(leftAddTempLoc);
            pushHex("XX");
            pushHex(loadXFromMemo);
            pushHex(leftAddTempLoc);
            pushHex("XX");
            pushHex(compareMemoToX);
        }

    	/* Handles Right Expression */

    	// Checks if right comparator is an id or digit
    	if (rightNode.type == "T_ID" || rightNode.type == "T_DIGIT" || rightNode.type == "T_BOOLEAN_VALUE" || rightNode.type == "T_CHARLIST") {
    		var varLoc1 = "";
    		var varLoc2 = "";
    		var scope = getScope(rightNode.scope);
    		var type = getVarType(scope, rightNode.name);
    		// console.log(type);
    		
    		if (type == "string") {
    			var tempStore = getTempStore(rightNode.name, rightNode.scope);
    			varLoc1 = tempStore[0];
    			varLoc2 = tempStore[1];
    		}
    		else {
    			var tempLoc = getTempLoc(rightNode.name, rightNode.scope);
    			varLoc1 = tempLoc[0];
    			varLoc2 = tempLoc[1];
    		}

    		pushHex(varLoc1);
    		pushHex(varLoc2)
    	}
    	else if (rightNode.name == "Addition") {
    		pushHex(rightAddTempLoc);
    		pushHex("XX");
    	}

    	// Based off Bloop (I don't understand why yet but we'll see later)
    	pushHex(loadXWithConst);
    	pushHex("00");
    	pushHex(branchNBytes);
    	pushHex("02");
    	pushHex(loadXWithConst);
    	pushHex("01");
    	pushHex(compareMemoToX);
    	pushHex(systemCall);
    	pushHex(breakOp);

        endInequality = codeTable.length;
        hexGenNum = endInequality - startInequality;

        // console.log("IfStatement Finished codeTableLoc: " + codeTable.length);
        // console.log("IfStatement Finished Hex Generated: " + hexGenNum);
    }

    function equalityCodeGen(node, depth) {
    	if (verbose) {
    		printFoundBranch(node.name, node.line, node.scope);
    		// console.log("Generating Code For Equality");
    	}
    	var startEquality = codeTable.length;
    	var endEquality = 0;
    	var hexGenNum = 0;
    	var leftNode = node.children[0];
    	var rightNode = node.children[1];
    	var leftString = "";
    	var rightString = "";
    	var rightAddTempLoc = "";

    	if ((leftNode.type == "T_ID" && rightNode.type == "T_CHARLIST") || (leftNode.type == "T_CHARLIST" && rightNode.type == "T_ID"))
    		throwCodeGenError("Variable to String comparison is not allowed...\n")
    	else if (leftNode.type == "T_ID" && rightNode.type == "T_ID") {
    		var scopeL = getScope(leftNode.scope);
    		var typel = getVarType(scopeL, leftNode.name);

    		var scopeR = getScope(rightNode.scope);
    		var type2 = getVarType(scopeR, rightNode.name);

    		if (typel == "string" && type2 == "string")
    			throwCodeGenError("String Variable to String Variable comparison is not allowed...\n");
    	}

    	// If the right comparator is a pure digit we need to store it in memory
    	if (rightNode.type == "T_DIGIT") {
    		varLocNum++;
    		var compInt = "0" + rightNode.name;
			var scope = getScope(rightNode.scope);
			var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
			var numSymbol = new Symbol(rightNode.name, "int", rightNode.line, rightNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, tempLoc+"XX");
			scope.symbols.push(numSymbol);

    		pushHex(loadAccWithConst);
    		pushHex(compInt);
    		pushHex(storeAccInMemo);
    		pushHex(tempLoc);
    		pushHex("XX");
    	}
    	// If the right comparator is a pure boolean we need to store it in memory
    	else if (rightNode.type == "T_BOOLEAN_VALUE") {
    		varLocNum++;
    		var compBool = "";
    		if (rightNode.name == "true")
    			compBool = "01";
    		else
    			compBool = "00";
    		var scope = getScope(rightNode.scope);
    		var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
    		var boolSymbol = new Symbol(rightNode.name, "boolean", rightNode.line, rightNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, tempLoc+"XX");
    		scope.symbols.push(boolSymbol);

    		pushHex(loadAccWithConst);
    		pushHex(compBool);
    		pushHex(storeAccInMemo);
    		pushHex(tempLoc);
    		pushHex("XX");
    	}
    	// Checks if the right comparator is a pure string
    	else if (rightNode.type == "T_CHARLIST") {
    		varLocNum++;
    		rightString = rightNode.name;
    		var compBool = "01";
    		var scope = getScope(rightNode.scope);
    		var tempLoc = varLocHead + varLocNumtoHex(varLocNum);
    		var stringSymbol = new Symbol(rightNode.name, "boolean", rightNode.line, rightNode.scope, parseInt(scope.name[scope.name.length-1]), true, true, tempLoc+"XX")
    		scope.symbols.push(stringSymbol);

    		pushHex(loadAccWithConst);
    		pushHex(compBool);
    		pushHex(storeAccInMemo);
    		pushHex(tempLoc);
    		pushHex("XX");
    	}
    	// Checks if the right comparator is an Addition
    	else if (rightNode.name == "Addition") {
    		// Entering Addition Called From BoolExpr
    		calledFromBoolExpr = true;
    		// Traverse Tree for Addition Node
    		rightAddTempLoc = traverseTree(rightNode, depth);
    		// Exiting Addition Called From BoolExpr
    		calledFromBoolExpr = false;

    		pushHex(rightAddTempLoc);
    		pushHex("XX");
    	}

    	/* Handles Left Expression */

    	// Checks if left comparator is an id
    	if (leftNode.type == "T_ID") {
    		var varLoc1 = "";
    		var varLoc2 = "";
    		var scope = getScope(leftNode.scope);
    		var type = getVarType(scope, leftNode.name);
    		// console.log(type);

    		if (type == "string") {
    			var tempStore = getTempStore(leftNode.name, leftNode.scope);
    			varLoc1 = tempStore[0];
    			varLoc2 = tempStore[1];
    		}
    		else {
    			var tempLoc = getTempLoc(leftNode.name, leftNode.scope);
    			varLoc1 = tempLoc[0];
    			varLoc2 = tempLoc[1];
    		}

    		pushHex(loadXFromMemo);
    		pushHex(varLoc1);
    		pushHex(varLoc2);
    		pushHex(compareMemoToX);
    	}
    	// Checks if the left comparator is a pure digit
    	else if (leftNode.type == "T_DIGIT") {
    		var compInt = "0" + leftNode.name;

    		pushHex(loadXWithConst);
    		pushHex(compInt);
    		pushHex(compareMemoToX);
    	}
    	// Check if the left comparator is a pure boolean
    	else if (leftNode.type == "T_BOOLEAN_VALUE") {
    		var compBool = "";
    		if (leftNode.name == "true")
    			compBool = "01";
    		else
    			compBool = "00";

    		pushHex(loadXWithConst);
    		pushHex(compBool);
    		pushHex(compareMemoToX);
    	}
    	// Checks if the left comparator is a pure string
    	else if (leftNode.type == "T_CHARLIST") {
    		leftString = leftNode.name;
    		var compBool = "";
    		// I swear this isn't cheating...
    		if (leftString == rightString) {
    			compBool = "01";
    		}
    		else
    			compBool = "00";

    		pushHex(loadXWithConst);
    		pushHex(compBool);
    		pushHex(compareMemoToX);
    	}
    	// Checks if the left comparator is an Addition
    	else if (leftNode.name == "Addition") {
    		// Entering Addition Called From BoolExpr
    		calledFromBoolExpr = true;
    		// Traverse Tree for Addition Node
    		var leftAddTempLoc = traverseTree(leftNode, depth);
    		// Exiting Addition Called From BoolExpr
    		calledFromBoolExpr = false;

    		pushHex(leftAddTempLoc);
    		pushHex("XX");
    		pushHex(loadXFromMemo);
    		pushHex(leftAddTempLoc);
    		pushHex("XX");
    		pushHex(compareMemoToX);
    	}

    	/* Handles Right Expression */

    	// Checks if right comparator is an id or digit
    	if (rightNode.type == "T_ID" || rightNode.type == "T_DIGIT" || rightNode.type == "T_BOOLEAN_VALUE" || rightNode.type == "T_CHARLIST") {
    		var varLoc1 = "";
    		var varLoc2 = "";
    		var scope = getScope(rightNode.scope);
    		var type = getVarType(scope, rightNode.name);
    		// console.log(type);
    		
    		if (type == "string") {
    			var tempStore = getTempStore(rightNode.name, rightNode.scope);
    			varLoc1 = tempStore[0];
    			varLoc2 = tempStore[1];
    		}
    		else {
    			var tempLoc = getTempLoc(rightNode.name, rightNode.scope);
    			varLoc1 = tempLoc[0];
    			varLoc2 = tempLoc[1];
    		}

    		pushHex(varLoc1);
    		pushHex(varLoc2)
    	}
    	else if (rightNode.name == "Addition") {
    		pushHex(rightAddTempLoc);
    		pushHex("XX");
    	}

    	endEquality = codeTable.length;
    	hexGenNum = endEquality - startEquality;

    	// console.log("IfStatement Finished codeTableLoc: " + codeTable.length);
        // console.log("IfStatement Finished Hex Generated: " + hexGenNum);
    }

 	function pushHex(hexVal) {
 		codeTable.push(hexVal);
 		if (verbose)
 			printPushHex(hexVal);
 	}

    function pushBooleanString(trueFalseHex) {
        for (var i = 0; i < trueFalseHex.length; i++) {
            pushHex(trueFalseHex[i]);
        }
    }

    function backPatchBooleanVal(codeTable, booleanTable, trueStringLoc, falseStringLoc) {
        var codeLocs = [];
        var codeLocNum = -1;

        for (var i = 0; i < codeTable.length; i++) {
        	if (codeTable[i] == "trueLoc")
        		codeTable[i] = trueStringLoc;
        	else if (codeTable[i] == "falseLoc")
        		codeTable[i] = falseStringLoc;
        }

        for (var symbol = 0; symbol < booleanTable.length; symbol++) {
            if (booleanTable[symbol].type == "boolean" && (/^boolean\d+$/.test(booleanTable[symbol].key)) || booleanTable[symbol].key == "true" || booleanTable[symbol].key == "false") {
                if (booleanTable[symbol].stringHex == "01")
                    codeLocs.push(trueStringLoc+"00");
                else 
                    codeLocs.push(falseStringLoc+"00");
            }
        }

        // console.log(codeLocs);

        for (var symbol = 0; symbol < booleanTable.length; symbol++) {
            if (booleanTable[symbol].type == "boolean" && (/^boolean\d+$/.test(booleanTable[symbol].key)) || booleanTable[symbol].key == "true" || booleanTable[symbol].key == "false") {
                codeLocNum++;
                var tempLoc = chunk(booleanTable[symbol].tempLoc,2);
                // console.log(tempLoc);
                var codeLoc = chunk(codeLocs[codeLocNum],2);
                // console.log(codeLoc);
                for (var newLoc = 0; newLoc < codeLocs.length; newLoc++) {
                    for (var hexCode  = 0; hexCode < codeTable.length-1; hexCode++) {
                        if (codeTable[hexCode] == tempLoc[0] && codeTable[hexCode+1] == tempLoc[1]) {
                            if (verbose)
                                printStatValBackPatch(booleanTable[newLoc].tempLoc, codeLocs[newLoc]);
                            codeTable[hexCode] = codeLoc[0];
                            codeTable[hexCode+1] = codeLoc[1];
                        }
                        else if (codeTable[hexCode] == tempLoc[0]) {
                            if (verbose)
                                printStatValBackPatch(booleanTable[newLoc].tempLoc, codeLocs[newLoc]);
                            codeTable[hexCode] = codeLoc[0];
                        }
                    }
                }
            }
        }

        for (var symbol = 0; symbol < stringTable.length; symbol++) {
            if (booleanTable[symbol].type == "boolean" && (/^boolean\d+$/.test(booleanTable[symbol].key)) || booleanTable[symbol].key == "true" || booleanTable[symbol].key == "false") {
                stringTable[symbol].tempLoc = codeLocs[symbol];
            }
        }
    }

 	function backPatchStringVal(codeTable, stringTable) {
 		//var dynamicMemStart = hexTable[codeTable.length + 1];
 		var codeLocs = [];
 		var codeLocNum = -1;

 		for (var symbol = 0; symbol < stringTable.length; symbol++) {
 			if (stringTable[symbol].type == "string" && stringTable[symbol].stringHex != undefined) {
 				var dynamicMemStart = hexTable[codeTable.length];
 				codeLocs.push(dynamicMemStart + "00");
 				for (var hexVal = 0; hexVal < stringTable[symbol].stringHex.length; hexVal++) {
 					codeTable.push(stringTable[symbol].stringHex[hexVal]);
 				}
 			}
 		}

 		// console.log(codeLocs);

 		for (var symbol = 0; symbol < stringTable.length; symbol++) {
 			if (stringTable[symbol].type == "string" && stringTable[symbol].stringHex != undefined) {
 				codeLocNum++;
	 			var tempLoc = chunk(stringTable[symbol].tempLoc,2);
	 			// console.log(tempLoc);
	 			var codeLoc = chunk(codeLocs[codeLocNum],2);
	 			// console.log(codeLoc);
		 		for (var newLoc = 0; newLoc < codeLocs.length; newLoc++) {
		 			for (var hexCode = 0; hexCode < codeTable.length-1; hexCode++) {
		 				if (codeTable[hexCode] == tempLoc[0] && codeTable[hexCode+1] == tempLoc[1]) {
		 					if (verbose)
		 						printStatValBackPatch(stringTable[newLoc].tempLoc, codeLocs[newLoc]);
		 					codeTable[hexCode] = codeLoc[0];
		 					codeTable[hexCode+1] = codeLoc[1];
		 				}
		 				else if (codeTable[hexCode] == tempLoc[0]) {
		 					if (verbose)
		 						printStatValBackPatch(stringTable[newLoc].tempLoc, codeLocs[newLoc]);
		 					codeTable[hexCode] = codeLoc[0];
		 				}
		 			}
		 		}
		 	}
 		}

 		for (var symbol = 0; symbol < stringTable.length; symbol++) {
			if (stringTable[symbol].type == "string" && stringTable[symbol].stringHex != undefined) {
 				stringTable[symbol].tempLoc = codeLocs[symbol];
			}
 		}
 	}

 	function backPatchStatVal(codeTable, staticTable) {
 		var staticMemStart = hexTable[codeTable.length + 1];
 		var tempLocs = [];

 		for (var symbol = 0; symbol < staticTable.length; symbol++) {
 			// console.log(staticTable[symbol]);
 			if (staticTable[symbol].type == "int")
 				tempLocs.push(staticTable[symbol].tempLoc);
 			else if (staticTable[symbol].type == "boolean" && !/^boolean\d+$/.test(staticTable[symbol].key)) {
 				tempLocs.push(staticTable[symbol].tempLoc);
 			}
 			else {
 				tempLocs.push(staticTable[symbol].tempStore);
 			}
 		}

 		// console.log(tempLocs);
		// console.log("Static Memory Starts At: " + staticMemStart);

		var endCode = codeTable.length;
		for (var loc = 0; loc < tempLocs.length; loc++) {
			endCode++;
			var availMem = hexTable[endCode];
			tempLocs[loc] = availMem + "00";
		}

		// console.log(tempLocs);

		for (var newLoc = 0; newLoc < tempLocs.length; newLoc++) {
 			var codeLoc = chunk(tempLocs[newLoc],2);
 			var tempLoc = "";
 			if (staticTable[newLoc].type == "int")
 				tempLoc = chunk(staticTable[newLoc].tempLoc,2);
 			else if (staticTable[newLoc].type == "boolean" && !/^boolean\d+$/.test(staticTable[newLoc].key))
 				tempLoc = chunk(staticTable[newLoc].tempLoc,2);
 			else
 				tempLoc = chunk(staticTable[newLoc].tempStore,2);

 			for (var hexCode = 0; hexCode < codeTable.length-1; hexCode++) {
 				if (codeTable[hexCode] == tempLoc[0] && codeTable[hexCode+1] == tempLoc[1]) {
 					if (verbose)
 						printStatValBackPatch(staticTable[newLoc].tempLoc, tempLocs[newLoc]);
 					codeTable[hexCode] = codeLoc[0];
 					codeTable[hexCode+1] = codeLoc[1];
 				}
                else if (codeTable[hexCode] == tempLoc[0]) {
                    if (verbose)
                        printStatValBackPatch(staticTable[newLoc].tempLoc, tempLoc[newLoc]);
                    codeTable[hexCode] = codeLoc[0];
                }
 			}
 		}

		for (var symbol = 0; symbol < staticTable.length; symbol++) {
			if (staticTable[symbol].type == "int")
 				staticTable[symbol].tempLoc = tempLocs[symbol];
 			else if (staticTable[symbol].type == "boolean" && !/^boolean\d+$/.test(staticTable[symbol].key))
 				staticTable[symbol].tempLoc = tempLocs[symbol];
            else
                staticTable[symbol].tempStore = tempLocs[symbol];
 		}
 	}

 	function backPatchJumpVal(codeTable, jumpTable) {
 		for (var i = 0; i < jumpTable.length; i++) {
 			var jumpName = jumpTable[i].tempName;
 			var jumpDistance = jumpTable[i].distance;
 			for (var hexCode = 0; hexCode < codeTable.length; hexCode++) {
 				
 				if (codeTable[hexCode] == jumpName) {
 					if (verbose)
 						printJumpBackPatch(jumpName, jumpDistance);
 					codeTable[hexCode] = jumpDistance;
 				}
 			}
 		}
 	}

 	function getFullSymbolTable(node) {
 		var staticMem = [];

 		if (node.symbols.length > 0) {
			// console.log("Adding Symbols to Static Memory...");
			staticMem.push(node.symbols);
			for (var child = 0; child < node.children.length; child++) {
				// console.log("Going to children...");
				var tempArray = getFullSymbolTable(node.children[child]);
				staticMem.push(tempArray);
			}
		}
		else {
			for (var child = 0; child < node.children.length; child++) {
				var tempArray = getFullSymbolTable(node.children[child]);
				staticMem.push(tempArray);
			}
		}

		return staticMem;
 	}

 	function flattenStaticTable(array) {
 		var flattenedTable = array;
		var arrayDepth = array_depth(array);

		for (i = 0; i < arrayDepth; i++) {
			flattenedTable = [].concat.apply([], flattenedTable);
		}

		return flattenedTable;

		function array_depth(array) {
			var max_depth = 0;

			array.forEach(function(value) {
				if (Array.isArray(value)) {
					var depth = array_depth(value) + 1;
		
					if (depth > max_depth) {
						max_depth = depth;
					}
				}
			});

			return max_depth;
		}
 	}

    function assignHexVal(node, varKey, stringHex) {
        if ((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
            for (var symbol = 0; symbol < node.symbols.length; symbol++) {
                if (varKey == node.symbols[symbol].getKey()) {
                    // console.log("Assigning String Hex to variable [ " + varKey + " ]");
                    node.symbols[symbol].stringHex = stringHex;
                    break;
                }
                else if (symbol == node.symbols.length-1 && (node.parent != undefined || node.parent != null)) {
                    assignHexVal(node.parent, varKey, stringHex);
                }
            }
        }
        else if (node.parent != undefined || node.parent != null) {
            assignHexVal(node.parent, varKey, stringHex);
        }
    }

 	function getTempStore(varKey, varKeyScope) {
 		var node = traverseST(st.root, varKeyScope);
 		// console.log("Returning scope where variable was assigned...");
 		// console.log(node);
 		var tempStore = getStoreForVal(node, varKey);
 		// console.log(tempStore);
 		tempStore = chunk(tempStore,2);

 		return tempStore;

 		function traverseST(node, varKeyScope) {
 			var returnNode;
 			if (node.scope == varKeyScope) {
 				// console.log("Found matching scope branch...");
 				returnNode = node;
 			}
 			else {
 				for (var scope = 0; scope < node.children.length; scope++) {
 					returnNode = traverseST(node.children[scope], varKeyScope);
 					if (returnNode != null || returnNode != undefined)
 						break;
 				}
 			}

 			return returnNode;
 		}

 		function getStoreForVal(node, varKey) {
 			var tempStore = "";
 			if ((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
	 			for (var symbol = 0; symbol < node.symbols.length; symbol++) {
	 				if (varKey == node.symbols[symbol].getKey() && node.symbols[symbol].tempLoc != undefined && node.symbols[symbol].tempLoc != null && node.symbols[symbol].tempLoc != "") {
	 					// console.log("Retrieving TempStore for variable [ " + varKey + " ]");
	 					tempStore = node.symbols[symbol].tempStore;
	 					break;
	 				}
	 				else if (symbol == node.symbols.length-1 && (node.parent != undefined || node.parent != null)) {
	 					tempStore = getStoreForVal(node.parent, varKey);
	 				}
	 			}
 			}
 			else if (node.parent != undefined || node.parent != null) {
				tempStore = getStoreForVal(node.parent, varKey);
			}

 			return tempStore;
 		}
 	}

 	function getTempLoc(varKey, varKeyScope) {
 		var node = traverseST(st.root, varKeyScope);
 		// console.log("Returning scope where variable was assigned...");
 		// console.log(node);
 		var tempLoc = getLocForVal(node, varKey);
 		// console.log(tempLoc);
 		tempLoc = chunk(tempLoc,2);

 		return tempLoc;

 		function traverseST(node, varKeyScope) {
 			var returnNode;
 			if (node.scope == varKeyScope) {
 				// console.log("Found matching scope branch...");
 				returnNode = node;
 			}
 			else {
 				for (var scope = 0; scope < node.children.length; scope++) {
 					returnNode = traverseST(node.children[scope], varKeyScope);
 					if (returnNode != null || returnNode != undefined)
 						break;
 				}
 			}

 			return returnNode;
 		}

 		function getLocForVal(node, varKey) {
 			var tempLoc = "";
 			if ((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
	 			for (var symbol = 0; symbol < node.symbols.length; symbol++) {
	 				if (varKey == node.symbols[symbol].getKey() && node.symbols[symbol].tempLoc != undefined && node.symbols[symbol].tempLoc != null && node.symbols[symbol].tempLoc != "") {
	 					// console.log("Retrieving TempLoc for variable [ " + varKey + " ]");
	 					tempLoc = node.symbols[symbol].tempLoc;
	 					break;
	 				}
	 				else if (symbol == node.symbols.length-1 && (node.parent != undefined || node.parent != null)) {
	 					tempLoc = getLocForVal(node.parent, varKey);
	 				}
	 			}
 			}
 			else if (node.parent != undefined || node.parent != null) {
				tempLoc = getLocForVal(node.parent, varKey);
			}

 			return tempLoc;
 		}
 	}

 	function getScope(digitScope) {
 		var node = traverseST(st.root ,digitScope);

 		return node;

 		function traverseST(node, digitScope) {
 			var returnNode;
 			if (node.scope == digitScope) {
 				// console.log("Found matching scope branch...");
 				returnNode = node;
 			}
 			else {
 				for (var child = 0; child < node.children.length; child++) {
 					returnNode = traverseST(node.children[child], digitScope);
 					if (returnNode != null || returnNode != undefined)
 						break;
 				}
 			}
 			// console.log(returnNode);
 			return returnNode;
 		}
 	}

 	function getVarType(node, varKey) {
 		var varType = "";
		if ((node.parent != undefined || node.parent != null) && node.symbols.length > 0) {
			for (var symbol = 0; symbol < node.symbols.length; symbol++) {
				if (varKey == node.symbols[symbol].getKey()) {
					// console.log("Retrieving Type for variable [ " + varKey + " ]");
					varType = node.symbols[symbol].type;
					break;
				}
				else if (symbol == node.symbols.length-1 && (node.parent != undefined || node.parent != null)) {
					varType = getVarType(node.parent, varKey);
				}
			}
		}
		else if (node.parent != undefined || node.parent != null) {
			varType = getVarType(node.parent, varKey);
		}

		return varType;
 	}

    function assignTempStore(varKey, varKeyScope, tempStore) {
        var node = traverseST(st.root, varKeyScope);

        for (var symbol = 0; symbol < node.symbols.length; symbol++) {
            if (varKey == node.symbols[symbol].getKey()) {
                node.symbols[symbol].tempStore = tempStore;
                break;
            }
        }

        // console.log(node);

        return node;

        function traverseST(node, varKeyScope) {
            var returnNode;
            if (node.scope == varKeyScope) {
                // console.log("Found matching scope branch...");
                returnNode = node;
            }
            else {
                for (var child = 0; child < node.children.length; child++) {
                    returnNode = traverseST(node.children[child], varKeyScope);
                    if (returnNode != null || returnNode != undefined)
                        break;
                }
            }
            // console.log(returnNode);
            return returnNode;
        }
    }

 	function assignTempLoc(varKey, varKeyScope, tempLoc) {
 		var node = traverseST(st.root, varKeyScope);

 		for (var symbol = 0; symbol < node.symbols.length; symbol++) {
 			if (varKey == node.symbols[symbol].getKey()) {
 				node.symbols[symbol].tempLoc = tempLoc;
 				break;
 			}
 		}

 		// console.log(node);

 		return node;

 		function traverseST(node, varKeyScope) {
 			var returnNode;
 			if (node.scope == varKeyScope) {
 				// console.log("Found matching scope branch...");
 				returnNode = node;
 			}
 			else {
 				for (var child = 0; child < node.children.length; child++) {
 					returnNode = traverseST(node.children[child], varKeyScope);
 					if (returnNode != null || returnNode != undefined)
 						break;
 				}
 			}
 			// console.log(returnNode);
 			return returnNode;
 		}
 	}

 	function varLocNumtoHex(varLocNum) {
 		var varLocNum = varLocNum.toString(16).toUpperCase();
 		return varLocNum;
 	}

 	function toHex(val) {
		var hex = "";
		for(var i = 0; i < val.length; i++) {
			hex += "" + val.charCodeAt(i).toString(16).toUpperCase();
		}
		hex = chunk(hex, 2);
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

	function printPushHex(hexVal) {
		txt = txt + " C.GEN --> | Pushing [ " + hexVal + " ] byte to memory...\n";
	}

	function printStatValBackPatch(hexVal, statMem) {
		txt = txt + " C.GEN --> | BackPatching memory location for [ " + hexVal + " ] to [ " + statMem + " ]...\n";
	}

	function printJumpBackPatch(hexVal, jumpDistance) {
		txt = txt + " C.GEN --> | BackPatching jump distance for [ " + hexVal + " ] to [ " + jumpDistance + " ]...\n";
	}

	function printPushStaticTable(elem) {
		txt = txt + " C.GEN --> | Pushing [ " + elem + " ] to Static Table...\n";
	}

	function printAssignLeaf(varKey, lineNum, value) {
		txt = txt + " C.GEN --> | Variable [ " + varKey + " ] on line " + lineNum + " is assigned [ " + value + " ]...\n";
	}

	function printCompareLeaf(varKey, lineNum, value) {
		if (value == "")
			txt = txt + " C.GEN --> | Variable [ " + varKey + " ] on line " + lineNum + " is being comapred with a value...\n";
		else
			txt = txt + " C.GEN --> | Variable [ " + varKey + " ] on line " + lineNum + " is compared to [ " + value + " ]...\n";
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
		txt = txt + " C.GEN --> | ERROR! " + reason;
		printLastCGMessage(codeComplete);
		// Updates Progess Status Bar
		$('#cgResults').html("<span style=\"color:red;\"> FAILED </span>");
		throw new Error("HOLY SHIT! IT DIED..." + reason);
	}
}