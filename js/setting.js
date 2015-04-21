document.addEventListener('DOMContentLoaded', function() {

	chrome.storage.local.get(function (result) {
		var cur_lamg, lang, langLisn = '';
		try {
			cur_lamg = result.lang||checkDefLang();
			lang = language[cur_lamg];
			for (var key in language) {
				langLisn += '<strong>'+key+'</strong> ';
			};
			GeneratorRex(lang.setting_lang + ' (' + langLisn.slice(0,-1) + ')' , 'lang', result.lang);

			GeneratorRex(lang.setting_salt, 'salt', result.salt||'');
			GeneratorRex(lang.setting_algorithm, 'algorithm', result.algorithm||'');

			document.body.insertAdjacentHTML('beforeend', language[cur_lamg].help_algorithm);
		} catch(e) {
			var timer = 4;

			saveSetting('lang',checkDefLang());

			document.body.className = 'error';
			document.body.innerHTML = 'Language error!<br>Reset language after '+(timer+1)+' seconds!';

			setInterval(function(){
				if (timer == 0) {
					window.location.reload();
				} else {
					document.body.innerHTML = 'Language error!<br>Reset language after '+timer+' seconds!';
					timer--;
				}
			},1000);
		};
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