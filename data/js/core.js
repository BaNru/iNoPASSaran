/**
 *
 * saveSetting
 *
 * Save setting in Chrome localStorage
 * Сохранение настроек в локальное хранилище Хрома.
 *
 * n - name
 * v - value
 *
 */
function saveSetting(n,v) {
	var dataObj = {};

	if (!n) {
		console.log('Error: No value specified');
		return;
	}

	dataObj[n] = v;

	chrome.storage.local.set(dataObj, function() {
	});
}

/**
 *
 * GeneratorRex
 * Генерирует поля ввода на странице настроек
 * Generates an input field on the settings page
 *
 * l = label text
 * n = attr name
 * v = attr value
 * 
 */
function GeneratorRex(l,n,v) {
	var label, input, intervalId = '';

	label = document.createElement('label');
	label.innerHTML = l;

	input = document.createElement('input');
	input.name = n;
	input.value = v;
	input.onkeyup = function(e){
		input.className = 'change';
		clearTimeout(intervalId);
		if (e.keyCode == 13) {
			saveSetting(input.name,input.value);
			input.className = 'save';
			return;
		}
		intervalId = setTimeout(function() {
			saveSetting(input.name,input.value);
			input.className = 'save';
		}, 2000);
	};
	label.appendChild(input);

	document.body.appendChild(label);
}


/**
 *
 * checkDefLang
 * 
 * Сheck default the language
 * 
 * Проверка языка по-умолчанию и сравнение с имеющимися в плагине.
 * Если язык системы пользователя присутсвует в плагине,
 * то возвращается системный язык, если нет,
 * то возвращается язык по умолчанию - английский.
 *
*/
function checkDefLang(){
	var deflang = window.navigator.language;
	for (var key in language) {
		if (deflang == key) {
			return key;
		}
	}
	return 'en';
}