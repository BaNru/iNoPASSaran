document.addEventListener('DOMContentLoaded', function() {

	chrome.storage.local.get(function (result) {
		GeneratorRex(chrome.i18n.getMessage('salt_title'), 'salt', result.salt||'');
		GeneratorRex(chrome.i18n.getMessage('algorithm_title'), 'algorithm', result.algorithm||'');

		GenHashList(result.hashtype, true);
	});

});

/**
 * local storage changed
 *
 * Notification of successful conservation
 * Уведомление об успешном сохранение
 *
 */
chrome.storage.onChanged.addListener(function(changes, namespace) {
	var div = document.createElement('div');
	div.className = "notice green";
	div.innerHTML = 'Сохранено!';
	document.body.appendChild(div);
	setTimeout(function(){
		document.body.removeChild(div);
	},1000);
});