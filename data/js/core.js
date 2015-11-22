/**
 * Отладка
 *
 * Передача в BackgroundPage
 *
 * в манифесте активировать BackgroundPage
 * , "background": {
 *  	"scripts": ["background.js"]
 * }
 * не забыв положить пустой background.js в корень
 */
//chrome.storage.onChanged.addListener(function(changes, namespace) {
	//chrome.extension.getBackgroundPage().console.log(changes, namespace);
//});


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
		if (typeof DATA !=="undefined") {
			chrome.storage.local.get(function (result) {
				DATA = result;
			})
		}
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
 *	TODO Переписать без генерации, сделать только функцию onkeyup
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