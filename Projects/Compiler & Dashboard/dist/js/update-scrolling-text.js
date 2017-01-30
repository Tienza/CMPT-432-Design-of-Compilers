function updateText(){
	var debug = false;
	var text = document.getElementById('console').value;
	
	if(debug)
		alert(document.getElementById("console").value);
	
	document.getElementById('tokenBanner').innerHTML = text;
}