function insertProgram(progNum) {
	
	// For storing program array before concatenation
	var testProgramArray;
	var testProgram = "";
	
	// Clears Console and Inserts Test Program 0
	if (progNum == 0) {
		$('#console').val("");
		$('#console').val("{}$");
		
		if (verbose) {
			$('#log').val("Inserted Program: Test Case " + progNum);
			console.log("Inserted Program: Test Case " + progNum);
		}
	}
	// Clears Console and Inserts Test Program 1
	else if (progNum == 1) {
		$('#console').val("");
		
		testProgramArray = [ "{", "\n", "\t", "p", "r", "i", "n", "t", "(", "\"", "t", "h", "e", "r", "e", " ", "i", "s", " ", "n", "o", " ", "s", "p", "o", "o", "n", "\"", ")", "\n", "}", "$" ]
		
		testProgramArray.forEach(function(element) {
			testProgram = testProgram + element;
		});
		
		$('#console').val(testProgram);
		
		if(verbose) {
			$('#log').val("Inserted Program: Test Case " + progNum);
			console.log("Inserted Program: Test Case " + progNum);
		}
	}
	// If no valid program number is provided, print WARNING to log
	else {
		if (verbose) {
			$('#log').val("No valid program number detected...");			
			console.log("No valid program number detected...");
		}
	}
}
