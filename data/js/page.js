chrome.runtime.onMessage.addListener(function(msg, sender, response) {
	this.document.activeElement.value = msg.pass;
});