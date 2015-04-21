document.addEventListener('DOMContentLoaded', function() {

	chrome.storage.local.get(function (result) {

		var input = document.createElement('input'),
			btn = document.createElement('button');
		// TODO Сделать show/hide
		btn.innerHTML = 'OK';
		btn.onclick = function(e){
			chrome.tabs.query({currentWindow: true, active: true}, function(tab){
				var strAlg = '',
					l = result['algorithm'].length;
				for(var i=0; i<l; i++){
					strAlg += alg(
									result['algorithm'][i],
									input.value,
									result['salt'],
									tab[0].url
								);
				}
				chrome.tabs.sendMessage(tab[0].id, {pass: hex_md5(strAlg)}, function(response) {
					// TODO Добавить на callback закрытие окна
				});
			});
		};
		document.body.appendChild(input);
		document.body.appendChild(btn);
	})
});


/**
 * TODO Сделать алиасы
 * TODO Расширить количество комбинаций
 */


/**
 *
 * Algorithm
 * 
 * a - generate algorithm
 * data - plugin chrome localStorage data
 * url - URL
 * pass - Master Password
 *
 * 0 - Доменое имя целиком
 * 1 - Доменая зона целиком
 * 2 - Первая половина домена
 * 3 - Вторая половина домена
 * 4 - Количества символов в домене
 * 5 - Количества символов в зоне
 * 6 - Соль целиком
 * 7 - Мастер пароль целиком
 * 8 - Первая половина мастер пароля
 * 9 - Вторая половина мастер пароля
 *
*/
function alg(a,pass,salt,url) {
//	var
//		_url 		= new URL(url).hostname.replace('www.',''),
//		parsrUrl	= _url.match(/(.*)\.(.*$)/),
//
//		_0		= parsrUrl[1],				// Доменное имя целиком
//		_1		= parsrUrl[2],				// Доменая зона целиком
//
//		_2_3	= halfString(_0),
//		_2		= _2_3[0],					// Первая половина домена
//		_3		= _2_3[1],					// Вторая половина домена
//
//		_4		= _0.length,				// Количества символов в домене
//		_5		= _1.length,				// Количества символов в зоне
//
//		_6		= salt,
//
//		_7		= pass,						// Мастер пароль целиком
//		_8_9	= halfString(pass),
//		_8		= _8_9[0],
//		_9		= _8_9[1];

	if (a == 0) {
		return new URL(url).hostname.replace('www.','').match(/(.*)\.(.*$)/)[1];
	};
	if (a == 1) {
		return new URL(url).hostname.replace('www.','').match(/(.*)\.(.*$)/)[2];
	};
	if (a == 2) {
		return halfString(
			new URL(url).hostname.replace('www.','').match(/(.*)\.(.*$)/)[1]
		)[0]
	};
	if (a == 3) {
		return halfString(
			new URL(url).hostname.replace('www.','').match(/(.*)\.(.*$)/)[1]
		)[1]
	};
	if (a == 4) {
		return new URL(url).hostname.replace('www.','').match(/(.*)\.(.*$)/)[1].length;
	};
	if (a == 5) {
		return new URL(url).hostname.replace('www.','').match(/(.*)\.(.*$)/)[2].length;
	};
	if (a == 6) {
		return salt;
	};
	if (a == 7) {
		return pass;
	};
	if (a == 8) {
		return halfString(pass)[0];
	};
	if (a == 9) {
		return halfString(pass)[1];
	};
	return '';
}


/**
 * Half String
 *
 * Разделение строки (str) пополам.
 * Если строка нечетная, то +1 к первой половине
 *
 * Return array[0,1]
 * 
 * Возвращает массив:
 * первая половина строки: halfString(str)[0]
 * вторая половина строки: halfString(str)[1]
 */
function halfString(str){
	var l = str.length,
		f = Math.floor(l/2),
		t = f;
	if(l % 2 > 0){
		t = f + 1;
	}
	return [ str.substring(0,t), str.substring(t,l) ];
}