function insertProgram(progNum) {
	var availableProgram = true;
	// For storing program array before concatenation
	var testProgramArray;
	var testProgram = "";
	
	// Inserts Test Program 0
	if (progNum == 0)
		testProgramArray = [ "/", "*", " ", "S", "i", "m", "p", "l", "e", " ", "P", "r", "o", "g", "r", "a", "m", " ", "-", " ", "N", "o", " ", "O", "p", "e", "r", "a", "t", "i", "o", "n", "s", " ", "*", "/", "\n", "{", "}", "$" ];
	// Inserts Test Program 1
	else if (progNum == 1)
		testProgramArray = [ "/", "*", " ", "P", "r", "i", "n", "t", " ", "O", "p", "e", "r", "a", "t", "i", "o", "n", " ", "*", "/", "\n", "{", "\n", "\t", "p", "r", "i", "n", "t", "(", "\"", "t", "h", "e", "r", "e", " ", "i", "s", " ", "n", "o", " ", "s", "p", "o", "o", "n", "\"", ")", "\n", "}", "$" ];
	// Inserts Alan's Test Case From Project 1
	else if (progNum == 2)
		testProgramArray = [ "/", "*", " ", " ", "P", "r", "o", "v", "i", "d", "e", "d", " ", "B", "y", " ", "\n", " ", " ", "-", " ", "C", "o", "m", "p", "i", "l", "e", "r", " ", "T", "y", "r", "a", "n", "t", "\n", " ", " ", "-", " ", "A", "l", "a", "n", " ", "G", " ", "L", "a", "b", "o", "u", "s", "e", "u", "r", "\n", "*", "/", "\n", "{", "}", "$", "\t", "\n", "{", "{", "{", "{", "{", "{", "}", "}", "}", "}", "}", "}", "$", "\t", "\n", "{", "{", "{", "{", "{", "{", "}", "}", "}", "}", "}", "}", "}", "$", "\t", "\n", "{", "i", "n", "t", "\t", "@", "}", "$" ];
	// Inserts Large Test Case
	else if (progNum == 3)
		testProgramArray = [ "/", "*", " ", "L", "o", "n", "g", " ", "T", "e", "s", "t", " ", "C", "a", "s", "e", " ", "-", " ", "E", "v", "e", "r", "y", "t", "h", "i", "n", "g", " ", "E", "x", "c", "e", "p", "t", " ", "B", "o", "o", "l", "e", "a", "n", " ", "D", "e", "c", "l", "a", "r", "a", "t", "i", "o", "n", " ", "*", "/", "\n", "{", "\n", "\t", "/", "*", " ", "I", "n", "t", " ", "D", "e", "c", "l", "a", "r", "a", "t", "i", "o", "n", " ", "*", "/", "\n", "\t", "i", "n", "t", " ", "a", "\n", "\t", "i", "n", "t", " ", "b", "\n", "\n", "\t", "a", " ", "=", " ", "0", "\n", "\t", "b", " ", "=", " ", "0", "\n", "\n", "\t", "/", "*", " ", "W", "h", "i", "l", "e", " ", "L", "o", "o", "p", " ", "*", "/", "\n", "\t", "w", "h", "i", "l", "e", " ", "(", "a", " ", "!", "=", " ", "3", ")", " ", "{", "\n", " ", " ", " ", " ", "\t", "p", "r", "i", "n", "t", "(", "a", ")", "\n", " ", " ", " ", " ", "\t", "w", "h", "i", "l", "e", " ", "(", "b", " ", "!", "=", " ", "3", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "p", "r", "i", "n", "t", "(", "b", ")", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "b", " ", "=", " ", "1", " ", "+", " ", "b", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "i", "f", " ", "(", "b", " ", "=", "=", " ", "2", ")", " ", "{", "\n", "\t", "\t", "\t", " ", " ", " ", " ", " ", " ", " ", " ", "/", "*", " ", "P", "r", "i", "n", "t", " ", "S", "t", "a", "t", "e", "m", "e", "n", "t", " ", "*", "/", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "p", "r", "i", "n", "t", "(", "\"", "t", "h", "e", "r", "e", " ", "i", "s", " ", "n", "o", " ", "s", "p", "o", "o", "n", "\"", "/", "*", " ", "T", "h", "i", "s", " ", "w", "i", "l", "l", " ", "d", "o", " ", "n", "o", "t", "h", "i", "n", "g", " ", "*", "/", ")", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "}", "\n", " ", " ", " ", " ", "\t", "}", "\n", "\n", " ", " ", " ", " ", "\t", "b", " ", "=", " ", "0", "\n", " ", " ", " ", " ", "\t", "a", " ", "=", " ", "1", " ", "+", " ", "a", "\n", "\t", "}", "\n", "}", "$" ];
	// Inserts Test Case With Missing $ at the end
	else if (progNum == 4)
		testProgramArray = [ "/", "*", " ", "T", "h", "i", "s", " ", "w", "i", "l", "l", " ", "g", "e", "n", "e", "r", "a", "t", "e", " ", "a", " ", "w", "a", "r", "n", "i", "n", "g", "\n", " ", "-", " ", " ", "b", "e", "c", "a", "u", "s", "e", " ", "t", "h", "e", "r", "e", " ", "i", "s", " ", "n", "o", " ", "\"", "$", "\"", "\n", " ", "-", " ", " ", "a", "t", " ", "t", "h", "e", " ", "e", "n", "d", " ", "o", "f", " ", "t", "h", "e", " ", "p", "r", "o", "g", "r", "a", "m", " ", "*", "/", "\n", "{", "\n", "\t", "i", "n", "t", " ", "a", "\n", "\t", "a", " ", "=", " ", "1", "\n", "}" ];
	// Inserts If Statement Test Case
	else if (progNum == 5)
		testProgramArray = [ "{", "\n", "\t", "i", "n", "t", " ", "a", "\n", "\t", "a", " ", "=", " ", "1", "\n", "\n", "\t", "i", "f", "(", "\"", "a", "\"", " ", "=", "=", " ", "\"", "a", "\"", ")", " ", "{", "\n", "\t", "\t", "a", " ", "=", " ", "2", "\n", "\t", "}", "\n", "\n", "\t", "i", "f", "(", "a", " ", "!", "=", " ", "1", ")", " ", "{", "\n", "\t", "\t", "a", " ", "=", " ", "3", "\n", "\t", "}", "\n", "\n", "\t", "i", "f", "(", "a", " ", "=", "=", " ", "1", ")", " ", "{", "\n", "\t", "\t", "a", " ", "=", " ", "3", "\n", "\t", "}", "\n", "}", " ", "$" ]
	// Inserts Invalid Print Statement Case
	else if (progNum == 6)
		testProgramArray = [ "{", "\n", "\t", "p", "r", "i", "n", "t", "(", "\"", "1", "2", "\"", ")", "\n", "}", "$" ];
	// Inserts Line Break String Case
	else if (progNum == 7)
		testProgramArray = [ "{", "\"", "t", "w", "o", "\n", "l", "i", "n", "e", "s", "\"", "}", "$" ];
	// Inserts Invalid String Decl
	else if (progNum == 8)
		testProgramArray = [ "/", "*", " ", "T", "h", "i", "s", " ", "w", "i", "l", "l", " ", "f", "a", "i", "l", " ", "b", "e", "c", "a", "u", "s", "e", " ", "a", "n", " ", "I", "d", "e", "n", "t", "i", "f", "i", "e", "r", "\n", " ", " ", "-", " ", "i", "s", " ", "e", "x", "p", "e", "c", "t", "e", "d", " ", "b", "u", "t", " ", "n", "o", "t", " ", "p", "r", "o", "v", "i", "d", "e", "d", " ", "*", "/", "\n", "{", "\n", "\t", "/", "*", " ", "1", " ", "i", "s", " ", "n", "o", "t", " ", "a", " ", "v", "a", "l", "i", "d", " ", "i", "d", "e", "n", "t", "i", "f", "i", "e", "r", " ", "*", "/", "\n", "\t", "s", "t", "r", "i", "n", "g", " ", "1", "\n", "}", "$" ];
	// Inserts Invalid Expr
	else if (progNum == 9)
		testProgramArray = [ "{", "\n", "\t", "a", " ", "+", " ", "3", "\n", "}", "$" ];
	// Inserts Print($)
	else if (progNum == 10)
		testProgramArray = [ "{", "\n", "\t", "p", "r", "i", "n", "t", "(", "$", ")", "\n", "}", "$" ];
	// Missing Expr line 19
	else if (progNum == 11)
		testProgramArray = [ "{", "\n", "\t", "i", "n", "t", " ", "a", "\n", " ", " ", " ", " ", "\t", "i", "n", "t", " ", "b", "\n", "\n", " ", " ", " ", " ", "\t", "a", " ", "=", " ", "0", "\n", " ", " ", " ", " ", "\t", "b", " ", "=", " ", "0", "\n", "\n", " ", " ", " ", " ", "\t", "w", "h", "i", "l", "e", " ", "(", "a", " ", "!", "=", " ", "3", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "p", "r", "i", "n", "t", "(", "a", ")", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "w", "h", "i", "l", "e", " ", "(", "b", " ", "!", "=", " ", "3", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "p", "r", "i", "n", "t", "(", "b", ")", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "b", " ", "=", " ", "1", " ", "+", " ", "b", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "i", "f", " ", "(", "b", " ", "=", "=", " ", "2", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "p", "r", "i", "n", "t", "(", "\"", "t", "h", "e", "r", "e", " ", "i", "s", " ", "n", "o", " ", "s", "p", "o", "o", "n", "\"", ")", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "}", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "}", "\n", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "b", " ", "=", " ", "0", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "a", " ", "=", " ", "1", " ", "+", " ", "\n", " ", " ", " ", "\t", " ", "}", "\n", "}", "$" ];
	// Undeclared Variable [ b ]
	else if (progNum == 12)
		testProgramArray = [ "{", "\n", " ", " ", " ", " ", "i", "n", "t", " ", "a", "\n", " ", " ", " ", " ", "a", " ", "=", " ", "0", "\n", " ", " ", " ", " ", "s", "t", "r", "i", "n", "g", " ", "z", "\n", " ", " ", " ", " ", "z", " ", "=", " ", "\"", "b", "o", "n", "d", "\"", "\n", " ", " ", " ", " ", "w", "h", "i", "l", "e", " ", "(", "a", " ", "!", "=", " ", "9", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", "i", "f", " ", "(", "a", " ", "!", "=", " ", "5", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "p", "r", "i", "n", "t", "(", "\"", "b", "o", "n", "d", "\"", ")", "\n", " ", " ", " ", " ", " ", " ", " ", "}", "\n", " ", " ", " ", " ", " ", " ", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "a", " ", "=", " ", "1", " ", "+", " ", "a", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "s", "t", "r", "i", "n", "g", " ", "b", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", " ", "=", " ", "\"", "j", "a", "m", "e", "s", " ", "b", "o", "n", "d", "\"", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "p", "r", "i", "n", "t", "(", "b", ")", "\n", " ", " ", " ", " ", " ", " ", " ", "}", "\n", " ", " ", " ", " ", "}", "\n", " ", " ", " ", " ", "{", "/", "*", "H", "o", "l", "y", " ", "H", "e", "l", "l", " ", "T", "h", "i", "s", " ", "i", "s", " ", "D", "i", "s", "g", "u", "s", "t", "i", "n", "g", "*", "/", "}", "\n", " ", " ", " ", " ", "b", "o", "o", "l", "e", "a", "n", " ", "c", "\n", " ", " ", " ", " ", "c", " ", "=", " ", "t", "r", "u", "e", "\n", " ", " ", " ", " ", "b", "o", "o", "l", "e", "a", "n", " ", "d", "\n", " ", " ", " ", " ", "d", " ", "=", " ", "(", "t", "r", "u", "e", " ", "=", "=", " ", "(", "t", "r", "u", "e", " ", "=", "=", " ", "f", "a", "l", "s", "e", ")", ")", "\n", " ", " ", " ", " ", "d", " ", "=", " ", "(", "a", " ", "=", "=", " ", "b", ")", "\n", " ", " ", " ", " ", "d", " ", "=", " ", "(", "1", " ", "=", "=", " ", "a", ")", "\n", " ", " ", " ", " ", "d", " ", "=", " ", "(", "1", " ", "!", "=", " ", "1", ")", "\n", " ", " ", " ", " ", "d", " ", "=", " ", "(", "\"", "s", "t", "r", "i", "n", "g", "\"", " ", "=", "=", " ", "1", ")", "\n", " ", " ", " ", " ", "d", " ", "=", " ", "(", "a", " ", "!", "=", " ", "\"", "s", "t", "r", "i", "n", "g", "\"", ")", "\n", " ", " ", " ", " ", "d", " ", "=", " ", "(", "\"", "s", "t", "r", "i", "n", "g", "\"", " ", "!", "=", " ", "\"", "s", "t", "r", "i", "n", "g", "\"", ")", "\n", " ", " ", " ", " ", "i", "f", " ", "(", "d", " ", "=", "=", " ", "t", "r", "u", "e", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "i", "n", "t", " ", "c", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "c", " ", "=", " ", "1", " ", "+", " ", "d", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "i", "f", " ", "(", "c", " ", "=", "=", " ", "1", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "p", "r", "i", "n", "t", "(", "\"", "u", "g", "h", "\"", ")", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "}", "\n", " ", " ", " ", " ", "}", "\n", " ", " ", " ", " ", "w", "h", "i", "l", "e", " ", "(", "\"", "s", "t", "r", "i", "n", "g", "\"", " ", "=", "=", " ", "a", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "w", "h", "i", "l", "e", " ", "(", "1", " ", "=", "=", " ", "t", "r", "u", "e", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "a", " ", "=", " ", "1", " ", "+", " ", "\"", "s", "t", "r", "i", "n", "g", "\"", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "}", "\n", " ", " ", " ", " ", "}", "\n", "}", "$" ];
	// Code Generation Fail - FUGLY
	else if (progNum == 13)
		testProgramArray = [ "{", "i", "n", "t", "i", "i", "=", "0", "s", "t", "r", "i", "n", "g", "s", "s", "=", "\"", "h", "e", "l", "l", "o", "\"", "b", "o", "o", "l", "e", "a", "n", "b", "b", "=", "(", "t", "r", "u", "e", "=", "=", "(", "1", "!", "=", "2", ")", ")", "i", "f", "(", "b", "=", "=", "t", "r", "u", "e", ")", "{", "w", "h", "i", "l", "e", "(", "t", "r", "u", "e", "!", "=", "(", "b", "!", "=", "(", "f", "a", "l", "s", "e", "=", "=", "(", "2", "!", "=", "3", ")", ")", ")", ")", "{", "i", "=", "1", "+", "i", "p", "r", "i", "n", "t", "(", "s", ")", "}", "}", "p", "r", "i", "n", "t", "(", "\"", "u", "g", "l", "y", " ", "c", "o", "d", "e", "\"", ")", "}", "$" ];
	// Boolean Test Case - Good Program
	else if (progNum == 14)
		testProgramArray = [ "{", "\n", "\t", "b", "o", "o", "l", "e", "a", "n", " ", "b", "\n", "\t", "b", " ", "=", " ", "t", "r", "u", "e", "\n", "\t", "b", " ", "=", " ", "f", "a", "l", "s", "e", "\n", "}", " ", "$" ];
	// Undeclared Variable [ b ] - FUGLY Version
	else if (progNum == 15)
		testProgramArray = [ "{", "i", "n", "t", "a", "a", "=", "0", "s", "t", "r", "i", "n", "g", "z", "z", "=", "\"", "b", "o", "n", "d", "\"", "w", "h", "i", "l", "e", "(", "a", "!", "=", "9", ")", "{", "i", "f", "(", "a", "!", "=", "5", ")", "{", "p", "r", "i", "n", "t", "(", "\"", "b", "o", "n", "d", "\"", ")", "}", "{", "a", "=", "1", "+", "a", "s", "t", "r", "i", "n", "g", "b", "b", "=", "\"", "j", "a", "m", "e", "s", " ", "b", "o", "n", "d", "\"", "p", "r", "i", "n", "t", "(", "b", ")", "}", "}", "{", "/", "*", "H", "o", "l", "y", " ", "H", "e", "l", "l", " ", "T", "h", "i", "s", " ", "i", "s", " ", "D", "i", "s", "g", "u", "s", "t", "i", "n", "g", "*", "/", "}", "b", "o", "o", "l", "e", "a", "n", "c", "c", "=", "t", "r", "u", "e", "b", "o", "o", "l", "e", "a", "n", "d", "d", "=", "(", "t", "r", "u", "e", "=", "=", "(", "t", "r", "u", "e", "=", "=", "f", "a", "l", "s", "e", ")", ")", "d", "=", "(", "a", "=", "=", "b", ")", "d", "=", "(", "1", "=", "=", "a", ")", "d", "=", "(", "1", "!", "=", "1", ")", "d", "=", "(", "\"", "s", "t", "r", "i", "n", "g", "\"", "=", "=", "1", ")", "d", "=", "(", "a", "!", "=", "\"", "s", "t", "r", "i", "n", "g", "\"", ")", "d", "=", "(", "\"", "s", "t", "r", "i", "n", "g", "\"", "!", "=", "\"", "s", "t", "r", "i", "n", "g", "\"", ")", "i", "f", "(", "d", "=", "=", "t", "r", "u", "e", ")", "{", "i", "n", "t", "c", "c", "=", "1", "+", "d", "i", "f", "(", "c", "=", "=", "1", ")", "{", "p", "r", "i", "n", "t", "(", "\"", "u", "g", "h", "\"", ")", "}", "}", "w", "h", "i", "l", "e", "(", "\"", "s", "t", "r", "i", "n", "g", "\"", "=", "=", "a", ")", "{", "w", "h", "i", "l", "e", "(", "1", "=", "=", "t", "r", "u", "e", ")", "{", "a", "=", "1", "+", "\"", "s", "t", "r", "i", "n", "g", "\"", "}", "}", "}", "$" ];
	// Code Generation Fail - Beautified
	else if (progNum == 16)
		testProgramArray = [ "{", "\r", "\n", " ", " ", " ", " ", "i", "n", "t", " ", "i", "\r", "\n", " ", " ", " ", " ", "i", " ", "=", " ", "0", "\r", "\n", " ", " ", " ", " ", "s", "t", "r", "i", "n", "g", " ", "s", "\r", "\n", " ", " ", " ", " ", "s", " ", "=", " ", "\"", "h", "e", "l", "l", "o", "\"", "\r", "\n", " ", " ", " ", " ", "b", "o", "o", "l", "e", "a", "n", " ", "b", "\r", "\n", " ", " ", " ", " ", "b", " ", "=", " ", "(", "t", "r", "u", "e", " ", "=", "=", " ", "(", "1", " ", "!", "=", " ", "2", ")", ")", " ", "i", "f", " ", "(", "b", " ", "=", "=", " ", "t", "r", "u", "e", ")", " ", "{", "\r", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "w", "h", "i", "l", "e", " ", "(", "t", "r", "u", "e", " ", "!", "=", " ", "(", "b", " ", "!", "=", " ", "(", "f", "a", "l", "s", "e", " ", "=", "=", " ", "(", "2", " ", "!", "=", " ", "3", ")", ")", ")", ")", " ", "{", "\r", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "i", " ", "=", " ", "1", " ", "+", " ", "i", "\r", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "p", "r", "i", "n", "t", "(", "s", ")", "\r", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "}", "\r", "\n", " ", " ", " ", " ", "}", "\r", "\n", " ", " ", " ", " ", "p", "r", "i", "n", "t", "(", "\"", "u", "g", "l", "y", " ", "c", "o", "d", "e", "\"", ")", "\r", "\n", "}", "$" ];
	else 
		availableProgram = false;
	
	// Clears Console and Resets page
	$('#console').val("");
	editor.setValue("");
	resetIndexPage();
	
	if (availableProgram) {
		
		testProgramArray.forEach(function(element) {
			testProgram = testProgram + element;
		});
		
		$('#console').val(testProgram);
		editor.setValue(testProgram);
		var row = editor.session.getLength() - 1
		var column = editor.session.getLine(row).length // or simply Infinity
		editor.gotoLine(row + 1, column)
	
		if (verbose) {
			$('#log').val("Inserted Program: Test Case " + progNum);
			console.log("Inserted Program: Test Case " + progNum);
		}
	}
	
	else {
		if (verbose) {
			$('#log').val("No valid program number detected...");			
			console.log("No valid program number detected...");
		}
	}
	
}