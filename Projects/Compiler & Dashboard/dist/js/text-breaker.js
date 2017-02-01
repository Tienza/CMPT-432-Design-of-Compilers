String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.replaceAllRX = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function isMatch(rx, str) {
    if (str.match(rx))
        return true;
    else
        return false;
}

function updateText() {
    var debug = false;

    var str = document.getElementById('console').value;

    if (debug)
        alert(document.getElementById("console").value);

    console.log(str);

    str = str.replace(/(\r\n|\n|\r)/gm, " ");

    var symbols = ["{", "}", "(", ")", "+", "==", "!=", "\"", "$"];

    for (var i = 0; i < symbols.length; i++) {
        var replacement = " " + symbols[i] + " ";
        str = str.replaceAll(symbols[i], replacement);
    }
    console.log(str);

    var sqRegex = /(\w+\s*?)(=)(\s*?\w+)/;

    str = str.replaceAllRX(sqRegex, "$1 = $3");


    str = str.split(" ");
	
	for(var n = 0; n < str.length; n++){
		if(str[n] != "{" && str[n] != "}" && str[n] != "(" && str[n] != ")" && str[n] != "+" && str[n] != "==" && str[n] != "!=" && str[n] != "=" && str[n] != "\"" && str[n] != "$")
			str[n] = str[n].trim();
	}
	
    console.log(str);

    cleanInput = [];

    for (var j = 0; j < str.length; j++) {
        if (str[j] !== "")
            cleanInput.push(str[j]);
    }

    var printToken = cleanInput;

    for (var l = 0; l < printToken.length; l++) {
        if (printToken[l] == "int")
            printToken[l] = "Variable Type [int]";
        else if (printToken[l] == "string")
            printToken[l] = "Variable Type [string]";
        else if (printToken[l] == "boolean")
            printToken[l] = "Variable Type [boolean]";
        else if (printToken[l] == "print")
            printToken[l] = "Print [print]";
		else if (printToken[l] == "while")
            printToken[l] = "While [while]";
        else if (printToken[l] == "if")
            printToken[l] = "If Statement [if]";
		else if (printToken[l] == "true")
            printToken[l] = "Boolean Value [true]";
		else if (printToken[l] == "false")
            printToken[l] = "Boolean Value [false]";
        else if (printToken[l] == "{")
            printToken[l] = "Left Brace [{]";
        else if (printToken[l] == "}")
            printToken[l] = "Right Brace [}]";
        else if (printToken[l] == "(")
            printToken[l] = "Left Paren [(]";
        else if (printToken[l] == ")")
            printToken[l] = "Right Paren [)]";
        else if (printToken[l] == "+")
            printToken[l] = "Addition Operator [+]";
        else if (printToken[l] == "==")
            printToken[l] = "Equality Operator [==]";
        else if (printToken[l] == "=")
            printToken[l] = "Assignment Operator [=]";
        else if (printToken[l] == "!=")
            printToken[l] = "Inequality Operator [!=]";
        else if (printToken[l] == "\"")
            printToken[l] = "Quote [\"]";
        else if (printToken[l] == "$")
            printToken[l] = "End of File Symbol [$]";
        else if (isMatch(/\d/, printToken[l]))
            printToken[l] = "Digit [" + printToken[l] + "]";
        else if (isMatch(/^[a-z]{1}$/, printToken[l]) && printToken[l-1] != "Quote [\"]")
            printToken[l] = "Identifier [" + printToken[l] + "]";
		else if (isMatch(/[a-z]{2,}/, printToken[l]) || isMatch(/^[a-z]{1}$/, printToken[l]) && printToken[l-1] == "Quote [\"]")
            printToken[l] = "String [" + printToken[l] + "]";
        else {
            console.log("Lexical Error with " + printToken[l]);
            break;
        }
    }

    var numberedTokens = [];
	var tokenTableVal = [];
	

    var tokenNumber = 1;

    for (var m = 0; m < printToken.length; m++) {
        numberedTokens[m] = "<span class=\"tokenStream\">" + tokenNumber + ": " + printToken[m] + "</span>";
		tokenTableVal[m] = "<tr class=\"tokenRow\"><td>" + tokenNumber + ": " + printToken[m] + "</td></tr>";
        tokenNumber++;
    }

    console.log(numberedTokens);

    document.getElementById('marquee-holder').innerHTML = "<marquee id='token-banner' behavior='scroll' direction='left' onmouseover='this.stop();' onmouseout='this.start();'>" + numberedTokens.join("") + "</marquee>";
	document.getElementById('tokenTable').innerHTML = "<th>" + numberedTokens.length + " Tokens</th>" + tokenTableVal.join("");
}