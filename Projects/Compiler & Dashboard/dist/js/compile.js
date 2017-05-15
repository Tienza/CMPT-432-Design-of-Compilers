function compile() {
	var codeGenerationReturns = codeGeneration();

	var txt = $('#log').val();

	var codeString = codeGenerationReturns.codeString;

	// console.log(codeString);

	var codeTable = codeGenerationReturns.codeArray;
	var dynamicMemStart = codeGenerationReturns.dynamicMemStart;

	var totalWarningCount = codeGenerationReturns.totalWarningCount;
	var totalErrorCount =  codeGenerationReturns.totalErrorCount;

	var machineCode = ["A9","6D","A2","A0","EA","D0","EE"]; 
	var memoryMachineCode = ["AD","8D","AE","AC","EC"];
	var printMachineCode = "FF";
	var ascii = ["61","62","63","64","65","66","67","68","69","6A","6B","6C","6D","6E","6F","70","71","72","73","74","75","76","77","78","79","7A"];

	for (var i = 0; i < codeTable.length; i++) {
		if (machineCode.includes(codeTable[i]) && i < dynamicMemStart)
			codeTable[i] = "<span style=\"color:#990000;\">" + codeTable[i] + "</span>";
		else if (memoryMachineCode.includes(codeTable[i]) && i < dynamicMemStart)
			codeTable[i] = "<span style=\"color:#bc7410\">" + codeTable[i] + "</span>";
		else if (codeTable[i] == printMachineCode && i < dynamicMemStart)
			codeTable[i] = "<span style=\"color:#000000\">" + codeTable[i] + "</span>";
		else if (ascii.includes(codeTable[i]) && i >= dynamicMemStart)
			codeTable[i] = "<span style=\"color:#275927;\">" + codeTable[i] + "</span>";
		else if (hexTable.includes(codeTable[i]))
			codeTable[i] = "<span style=\"color:#214f78;\">" + codeTable[i] + "</span>";
	}

	var printCode = "";
	for (var i = 0; i < codeTable.length; i++) {
		printCode = printCode + codeTable[i] + "  ";
	}
	$("#codeDisplay").attr('class', 'col-lg-12');
	$('#codeView').html(printCode);
	//$('#codeView').height("130px");

	// Compilation Succeeded
	if (totalErrorCount == 0) {
		// Prints Last Semantic Analysis Message
		printLastCompileMessage(codeComplete);
	}

	function printLastCompileMessage(codeComplete) {
		if (codeComplete) {
			txt = $('#log').val(txt + "Compilation Completed With " + totalWarningCount + " WARNING(S) and " + totalErrorCount + " ERROR(S)\n");
		}
		scrollDown();
	}
}