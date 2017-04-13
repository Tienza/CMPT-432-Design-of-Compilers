// Global Boolean Declarations
var verbose = true;

var byChar = true;

// Global Status Boolean Declarations
var lexComplete = false;
var parseComplete = false;
var semanticComplete = false;
var codeComplete = false;

var $textarea = $('#log');

var editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/java");
editor.$blockScrolling = Infinity;

// Function to do a "replace all" on a string. Because this doesn't exit natively in JavaScript
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// Function to do a "replace all" on a string using RegEx. Because this doesn't exit natively in JavaScript
String.prototype.replaceAllRX = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// Function to do delete a value from an array. Because apparently this doesn't exit natively in JavaScript
Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

// Function that returns a boolean if there is a regex match, used during lex
function isMatch(rx, str) {
    if (str.match(rx))
        return true;
    else
        return false;
}

// Toggles whether the compiler will be in "Verbose Mode" or not. (Might move to different file later)
function toggleVerbose() {
    verbose = !verbose;

    if (!verbose) {
        $('#verboseToggle').html("Verbose: Off")
        $('#verboseToggle').toggleClass('btn btn-danger btn-lg');
        $('#verboseToggle').toggleClass('btn btn-default btn-lg');
		$('#verboseDropDown').toggleClass('btn btn-danger btn-lg dropdown-toggle');
        $('#verboseDropDown').toggleClass('btn btn-default btn-lg dropdown-toggle');
    } else {
        $('#verboseToggle').html("Verbose: On")
        $('#verboseToggle').toggleClass('btn btn-default btn-lg');
        $('#verboseToggle').toggleClass('btn btn-danger btn-lg');
        $('#verboseDropDown').toggleClass('btn btn-default btn-lg dropdown-toggle');
		$('#verboseDropDown').toggleClass('btn btn-danger btn-lg dropdown-toggle');
		
    }
}

// Toggles whether the Lexer will treat strings as String Blocks or CharLists
function toggleByChar() {
	byChar = !byChar;
	
	if (!byChar) {
        $('#byCharToggle').html("Lex String By: Char")
    } else {
        $('#byCharToggle').html("Lex String By: Block")
    }
}

// Resets key components in index.html to default state
function resetIndexPage() {
	// Reset Boolean Values
	lexComplete = false;
	parseComplete = false;
	semanticComplete = false;
	codeComplete = false;
	// Reset Page Elements
	$('#lexResults').html(" --- ");
	$('#parseResults').html(" --- ");
	$('#saResults').html(" --- ");
	$('#cgResults').html(" --- ");
    $('#marquee-holder').html("No Tokens");
	$('#tokenTable').html("<th>No Tokens</th>");
	$('#cstLog').val("");
	$('#astLog').val("");
	$('#streeLog').val("");
	$('#symbolTable').html("<th style=\"line-height:209px;\">No Symbols</th>");
}

// Copies all log messages to clipboard
function copyText(copyLoc) {
	$(copyLoc).select();
    document.execCommand('copy');
	clearSelection();
	showToast('copyMessage');
}

// Clears selection of text in log after copyText is called
function clearSelection() {
    if ( document.selection ) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }
}

// Shows custom toast messages, as a form of notification for the user
function showToast(toastId) {
    var x = document.getElementById(toastId);
    x.className = "toast show";
    setTimeout(function(){ x.className = x.className.replace("toast show", "toast"); }, 1500);
}

// Scroll to bottom of textarea
function scrollDown() {
	$textarea.scrollTop($textarea[0].scrollHeight);
}

// Changes Smiley's teeth according to Compulation Stage.
function brokenTeeth(brokenLevel) {
	if (brokenLevel == 0)
		$('#teeth').attr('src', '../img/teeth.png');
	else if (brokenLevel == 1)
		$('#teeth').attr('src', '../img/lexTeeth.png');
}