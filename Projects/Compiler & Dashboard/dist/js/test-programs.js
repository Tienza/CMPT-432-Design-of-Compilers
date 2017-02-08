function insertProgram(progNum) {
	var availableProgram = true;
	// For storing program array before concatenation
	var testProgramArray;
	var testProgram = "";
	
	// Clears Console and Inserts Test Program 0
	if (progNum == 0)
		testProgramArray = [ "{", "}", "$"];
	// Clears Console and Inserts Test Program 1
	else if (progNum == 1)
		testProgramArray = [ "{", "\n", "\t", "p", "r", "i", "n", "t", "(", "\"", "t", "h", "e", "r", "e", " ", "i", "s", " ", "n", "o", " ", "s", "p", "o", "o", "n", "\"", ")", "\n", "}", "$" ];
	// Clears Console and Inserts Alan's Test Case From Project 1
	else if (progNum == 2)
		testProgramArray = [ "{", "}", "$", "\t", "\n", "{", "{", "{", "{", "{", "{", "}", "}", "}", "}", "}", "}", "$", "\t", "\n", "{", "{", "{", "{", "{", "{", "}", "}", "}", "}", "}", "}", "}", "$", "\t", "\n", "{", "i", "n", "t", "\t", "@", "}", "$" ];
	// Clears Console and Inserts Large Test Case
	else if (progNum == 3)
		testProgramArray = [ "{", "\n", "\t", "i", "n", "t", " ", "a", "\n", " ", " ", " ", " ", "\t", "i", "n", "t", " ", "b", "\n", "\n", " ", " ", " ", " ", "\t", "a", " ", "=", " ", "0", "\n", " ", " ", " ", " ", "\t", "b", " ", "=", " ", "0", "\n", "\n", " ", " ", " ", " ", "\t", "w", "h", "i", "l", "e", " ", "(", "a", " ", "!", "=", " ", "3", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "p", "r", "i", "n", "t", "(", "a", ")", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "w", "h", "i", "l", "e", " ", "(", "b", " ", "!", "=", " ", "3", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "p", "r", "i", "n", "t", "(", "b", ")", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "b", " ", "=", " ", "1", " ", "+", " ", "b", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "i", "f", " ", "(", "b", " ", "=", "=", " ", "2", ")", " ", "{", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "p", "r", "i", "n", "t", "(", "\"", "t", "h", "e", "r", "e", " ", "i", "s", " ", "n", "o", " ", "s", "p", "o", "o", "n", "\"", ")", "\n", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "\t", "}", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "}", "\n", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "b", " ", "=", " ", "0", "\n", " ", " ", " ", " ", " ", " ", " ", " ", "\t", "a", " ", "=", " ", "1", " ", "+", " ", "a", "\n", " ", " ", " ", "\t", " ", "}", "\n", "}" , "$" ];
	// Clears Console and Inserts Test Case With Missing $ at the end
	else if (progNum == 4)
		testProgramArray = [ "{", "\n", "\t", "i", "n", "t", " ", "a", "\n", "\t", "a", " ", "=", " ", "1", "\n", "}" ];
	// Clears Console and Inserts If Statement Test Case
	else if (progNum == 5)
		testProgramArray = [ "{", "\n", "\t", "i", "n", "t", " ", "a", "\n", "\t", "a", " ", "=", " ", "1", "\n", "\n", "\t", "i", "f", "(", "a", " ", "=", "=", " ", "1", ")", " ", "{", "\n", "\t", "\t", "a", " ", "=", " ", "2", "\n", "\t", "}", "\n", "\n", "\t", "i", "f", "(", "a", " ", "!", "=", " ", "1", ")", " ", "{", "\n", "\t", "\t", "a", " ", "=", " ", "3", "\n", "\t", "}", "\n", "}", " ", "$" ];
	// Clears Console and Inserts Invalid Print Statement Case
	else if (progNum == 6)
		testProgramArray = [ "{", "\n", "\t", "p", "r", "i", "n", "t", "(", "\"", "1", "2", "\"", ")", "\n", "}", "$" ];
	// If no valid program number is provided, print WARNING to log
	else {
		availableProgram = false;
	}
	
	// Clears Console and Resets the Progress Bar
	$('#console').val("");
	$('#lexResults').html(" INCOMPLETE ");
	$('#parseResults').html(" INCOMPLETE ");
	$('#saResults').html(" INCOMPLETE ");
	$('#cgResults').html(" INCOMPLETE ");
	
	if (availableProgram) {
		
		testProgramArray.forEach(function(element) {
			testProgram = testProgram + element;
		});
		
		$('#console').val(testProgram);
	
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
