function copyLog() {
	$('#log').select();
    document.execCommand('copy');
	clearSelection();
	showToast('copyMessage');
}
function clearSelection() {
    if ( document.selection ) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }
}
function showToast(toastId) {
    var x = document.getElementById(toastId);
    x.className = "toast show";
    setTimeout(function(){ x.className = x.className.replace("toast show", "toast"); }, 1500);
}