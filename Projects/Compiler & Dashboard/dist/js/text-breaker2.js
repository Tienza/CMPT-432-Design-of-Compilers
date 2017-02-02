var debug = true;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.replaceAllRX = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

function isMatch(rx, str) {
    if (str.match(rx))
        return true;
    else
        return false;
}

function breakText() {
    var printTokens = true;

    document.getElementById('log').value = "";

    var str = document.getElementById('console').value;

    str = str.replace(/(\r\n|\n|\r)/gm, " ");

    DELIMITER_PATTERN = /([a-z]+)|(\d+)|(")([^"]*)(")|(==)|(!=)|(\S)/g;

    str = str.split(DELIMITER_PATTERN);

    codeFrag = str.clean(undefined);

    console.log(codeFrag);

    var tokens = []

    for (var i = 0; i < codeFrag.length; i++) {
        token = codeFrag[i].trim();

        if (token !== undefined) {
            // Regex for Left Brace
            if (isMatch(/^{$/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "Left Brace [{]";
            }
            // Regex for Right Brace
            else if (isMatch(/^}$/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "Right Brace [}]";
            }
            // Regex for Left Parenthesis
            else if (isMatch(/^\($/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "Left Parenthesis [(]";
            }
            // Regex for Right Parenthesis
            else if (isMatch(/^\)$/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "Right Parenthesis [)]";
            }
            // Regex for End of Program Symbol
            else if (isMatch(/^\$$/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "End of Program Symbol [$]";
            }
            // Regex for Equality Operator
            else if (isMatch(/^==$/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "Equality Operator [==]";
            }
            // Regex for Inequality Operator
            else if (isMatch(/^!=$/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "Inequality Operator [!=]";
            }
            // Regex for Assignment Operator
            else if (isMatch(/^=$/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "Assignment Operator [=]";
            }
            // Regex for Addition Operator
            else if (isMatch(/^\+$/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "Addition Operator [+]";
            }
            // Regex for Print
            else if (isMatch(/^print$/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "Print [print]";
            }
            // Regex for While 
            else if (isMatch(/^while$/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "While [while]";
            }
            // Regex for If
            else if (isMatch(/^if$/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "If [if]";
            }
            // Regex for Variable Type
            else if (isMatch(/^int|string|boolean$/, token)) {
                var type = token.match(/^int|string|boolean$/);
                if (debug)
                    console.log(token);
                tokens[i] = "Variable Type [" + type[0] + "]";
            }
            // Regex for Boolean Value
            else if (isMatch(/^true|false$/, token)) {
                var boolVal = token.match(/^true|false$/);
                if (debug)
                    console.log(token);
                tokens[i] = "Boolean Value [" + boolVal[0] + "]";
            }
            // Regex for Identifiers
            else if (isMatch(/^[a-z]$/, token) && codeFrag[i - 1] != "\"") {
                var iden = token.match(/^[a-z]$/);
                if (debug)
                    console.log(token);
                tokens[i] = "Identifier [" + iden[0] + "]";
            }
            // Regex for Digits
            else if (isMatch(/^[0-9]$/, token)) {
                var digit = token.match(/^[0-9]$/);
                if (debug)
                    console.log(token);
                tokens[i] = "Digit [" + digit[0] + "]";
            }
            // Regex for Quotation
            else if (isMatch(/^"$/, token)) {
                if (debug)
                    console.log(token);
                tokens[i] = "Quotation [\"]";
            }
            // Regex for String
            else if (isMatch(/^".*?"$/, token)) {
                var string = token.match(/^"(.*?)"$/);
                if (debug)
                    console.log(token);
                tokens[i] = "String [" + string[0] + "]";
            }
            // Regex for String
            else if (isMatch(/^[a-z\s]*$/, token) && codeFrag[i - 1] == "\"" && codeFrag[i + 1] == "\"") {
                var string = token.match(/^[a-z\s]*$/);
                if (debug)
                    console.log(token);
                tokens[i] = "String [" + string[0] + "]";
            }
            // Regex for White Space
            else if (token === "") {
                if (debug)
                    console.log(token);
            } else {
                document.getElementById('log').value = "LEX ERROR - Unrecognized Character " + "[\"" + token + "\"]";
                document.getElementById('marquee-holder').innerHTML = "";
                document.getElementById('tokenTable').innerHTML = "<th>No Tokens</th>";
                printTokens = false
                break;
            }

        }

    }

    tokens = tokens.clean(undefined);

    console.log(tokens);

    if (printTokens) {
        document.getElementById('log').value = "Lex Successful...";

        marqueeTokens = [];
        tableTokens = [];

        var tokenNumber = 1;

        for (var m = 0; m < tokens.length; m++) {
            marqueeTokens[m] = "<span class=\"tokenStream\">" + tokenNumber + ": " + tokens[m] + "</span>";
            tableTokens[m] = "<tr class=\"tokenRow\"><td>" + tokenNumber + ": " + tokens[m] + "</td></tr>";
            tokenNumber++;
        }

        document.getElementById('marquee-holder').innerHTML = "<marquee id='token-banner' behavior='scroll' direction='left' onmouseover='this.stop();' onmouseout='this.start();'>" + marqueeTokens.join("") + "</marquee>";
        document.getElementById('tokenTable').innerHTML = "<th>" + tokens.length + " Tokens</th>" + tableTokens.join("");
    }

}