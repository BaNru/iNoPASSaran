var DATA, DOMAIN,
	password	= document.getElementById('password'),
	passinsert	= document.getElementById('passinsert'),
	passshow	= document.getElementById('passshow'),
	showpassbtn	= document.getElementById('showpassbtn'),
	showpass	= document.getElementById('showpass'),
	showpassi	= document.getElementById('showpassi'),
	copybtn		= document.getElementById('copy'),
	pbtn		= document.querySelectorAll('.pbtn li'),
	pbtnH		= document.querySelectorAll('.pbtnH'),
	salt_input	= document.getElementById('salt'),
	alg_input	= document.getElementById('algorithm'),
	site_input	= document.getElementById('site');


passshow.addEventListener('change', function () {
	if (this.checked == true) {
		password.type = 'text';
	} else {
		password.type = 'password';
	}
})


/**
 *
 * pbtnTabs
 *
 * Switching from advanced blocks
 * Переключение блоков с расширенными возможностями
 *
 * default - this element containing attribute data-show="id_show_block"
 *
 */
function pbtnTabs() {
	var test = true;
	// Обнуляем поле с паролем на всякий случай
	showpassi.value = "";
	if (this.classList.contains('active')) {
		test = false;
	}
	[].forEach.call(pbtnH, function(el) {
		el.classList.add('hide');
	});
	[].forEach.call(pbtn, function(el) {
		el.classList.remove('active');
	});
	if (test) {
		this.classList.add('active');
		document.querySelector('#'+this.dataset.show).classList.remove('hide');
	}

// @exclude
	if (typeof chrome !== "undefined"){
// @endexclude
// @if NODE_ENV='chrome'
		document.documentElement.style.minHeight = document.body.offsetHeight + 'px';
// @endif
// @exclude
	} else {
// @endexclude
// @if NODE_ENV='firefox'
		self.port.emit("resize", [document.body.offsetWidth,document.body.offsetHeight]);
// @endif
// @exclude
	}
// @endexclude
}
[].forEach.call(pbtn, function(element, index, array) {
	if(element.dataset.show){
		element.addEventListener('click', pbtnTabs);
	}
})

function init(){
	var rules = ['subdomain','trim','login'];

	rules.forEach(function(el, i) {
		var rules_input = document.getElementById(el);

		rules_input.onchange = function(){
			var obj = {};

			if (search_domain() == false) {
				DATA[DOMAIN] = {};
			}
			obj = DATA[DOMAIN];

			if (this.type == "checkbox") {
				obj[el] = this.checked;
			} else {
				obj[el] = this.value;
			}
// @exclude
			if (typeof chrome !== "undefined"){
// @endexclude
// @if NODE_ENV='chrome'
				saveSetting(DOMAIN,obj);
// @endif
// @exclude
			} else {
// @endexclude
// @if NODE_ENV='firefox'
				DATA[DOMAIN] = obj;
				self.options.data = JSON.stringify(DATA);
				self.port.emit("update", self.options.data);
// @endif
// @exclude
			}
// @endexclude
		};
		if (DATA && DATA[DOMAIN] && DATA[DOMAIN][el]) {
			if (typeof DATA[DOMAIN][el] === "boolean") {
				rules_input.checked = DATA[DOMAIN][el];
			} else {
				rules_input.value = DATA[DOMAIN][el];
			}
		}
	});
}


// @exclude
// TODO Провести рефакторинг и оптимизацию!
// TODO Разобраться с доменами при рефакторинге!
if (typeof chrome !== "undefined"){
// @endexclude
// @if NODE_ENV='chrome'
	chrome.storage.local.get(function (result) {
		DATA = result;

		if (!DATA['algorithm'] || !DATA['salt']) {
			//alert("Настройте ¡No PASSarán!");
			//try {
			//	chrome.tabs.create({ 'url': 'chrome-extension://'+chrome.runtime.id+'/data/setting.html'});
			//} catch(e) {
			//	alert(e);
			//}
			error_cfg();
		}

		[].forEach.call(document.querySelectorAll('[data-l10n-id]'), function(el, i) {
			el.innerHTML = chrome.i18n.getMessage(el.dataset.l10nId)
		});

		chrome.tabs.query({currentWindow: true, active: true}, function(tab){

			DOMAIN = new URL(tab[0].url).hostname;
			DOMAIN = DOMAIN.substring(DOMAIN.lastIndexOf(".", DOMAIN.lastIndexOf(".") - 1) + 1);

			init();

			passinsert.onclick = function(e){
				chrome.tabs.sendMessage(
					tab[0].id, {
						pass: genPass(
							DATA['algorithm']||false,
							password.value,
							DATA['salt']||false,
							tab[0].url
						)
					}
				);
				window.close();
			};
			password.addEventListener("keyup", function(e) {
				if (e.keyCode === 13) {
					chrome.tabs.sendMessage(
						tab[0].id, {
							pass: genPass(
								DATA['algorithm']||false,
								password.value,
								DATA['salt']||false,
								tab[0].url
							)
						}
					);
					window.close();
				} else {
					if (showpassbtn.classList.contains('active')) {
						showpassi.value = genPass(
							DATA['algorithm']||false,
							password.value,
							DATA['salt']||false,
							tab[0].url
						);
					}
				}
			}, false);

			copybtn.addEventListener('click', function click(event) {
				this.classList.remove('ok');
				const input = document.createElement('input');
				input.style.position = 'fixed';
				input.style.opacity = 0;
				input.value = genPass(
								DATA['algorithm']||false,
								password.value,
								DATA['salt']||false,
								tab[0].url
							);
				document.body.appendChild(input);
				input.select();
				document.execCommand('Copy', false, null);
				document.body.removeChild(input);
				this.classList.add('ok');
			})

			showpassbtn.addEventListener('click', function click(event) {
				showpassi.value = genPass(
					DATA['algorithm']||false,
					password.value,
					DATA['salt']||false,
					tab[0].url
				);
			})

		});
	})

	password.focus();
// @endif
// @exclude
} else { // Firefox
// @endexclude
// @if NODE_ENV='firefox'
	DOMAIN = new URL(self.options.url).hostname;
	DOMAIN = DOMAIN.substring(DOMAIN.lastIndexOf(".", DOMAIN.lastIndexOf(".") - 1) + 1);

	if (self.options.data == '') {
		DATA = {};
	} else {
		DATA = JSON.parse(self.options.data);
	}

	init();

	passinsert.addEventListener('click', function click(event) {
		self.port.emit(
			"text-entered",
			genPass(
				self.options.algorithm
				, password.value
				, self.options.salt
				, self.options.url
			)
		);
	}, false);
	password.addEventListener("keyup", function(e) {
        if (e.keyCode === 13) {
            self.port.emit(
				"text-entered",
				genPass(
					self.options.algorithm
					, password.value
					, self.options.salt
					, self.options.url
				)
			);
        } else {
			if (showpassbtn.classList.contains('active')) {
				showpassi.value = genPass(
					self.options.algorithm
					, password.value
					, self.options.salt
					, self.options.url
				)
			}
		}
    }, false);

	copybtn.addEventListener('click', function click(event) {
			this.classList.remove('ok');
			this.offsetWidth = this.offsetWidth;
			self.port.emit("copy", genPass(
				self.options.algorithm
				, password.value
				, self.options.salt
				, self.options.url
			));
			this.classList.add('ok');
	})

	showpassbtn.addEventListener('click', function click(event) {
		showpassi.value = genPass(
			self.options.algorithm
			, password.value
			, self.options.salt
			, self.options.url
		);
	})

	self.port.on("show", function onShow() {
		password.focus();
	});
// @endif
// @exclude
}
// @endexclude
// @if NODE_ENV='online'
	init();
	DOMAIN = new URL(window.location.href).hostname;
	DATA = {};
	[salt_input, password, alg_input].forEach(function(el){
		el.addEventListener("keyup", function() {
			if (showpassbtn.classList.contains('active')) {
				showpassi.value = genPass(
					false,
					password.value,
					false,
					// TODO Добавить предупреждение
					// window.location.href
					(function() {
						if (site_input.value) {
							return 'http://'+site_input.value.replace(/https?:\/\//,'')
						} else {
							return false
						}
					})()
				);
			}
		});
	});
	showpassbtn.addEventListener('click', function click(event) {
		if (showpassbtn.classList.contains('active')) {
			showpassi.value = genPass(
				false,
				password.value,
				false,
				(function() {
					if (site_input.value) {
						return 'http://'+site_input.value.replace(/https?:\/\//,'')
					} else {
						return false
					}
				})()
			);
		} else {
			showpassi.value = "";
		}
	})
// @endif


/**
 *
 * Gen Pasword from Algorithm
 *
 */
function genPass(a,pass,salt,url){
	var strAlg = ''
		, l;

	// Проверка заполненности полей в режиме гостя
	a = alg_input.value || a || error_cfg();
	salt = salt_input.value || salt || error_cfg();

	a = a.toLowerCase();
	if (a.indexOf(' ') >= 0) {
		a = a.split(' ');
	}
	l = a.length;
	for(var i=0; i<l; i++){
		strAlg += alg(
			a[i],
			pass,
			salt,
			url
		);
	}
	if (DATA && DATA[DOMAIN] && DATA[DOMAIN].trim) {
		var sb = DATA[DOMAIN].trim.match(/(-?[0-9]+)(?:.*?(-?[0-9]+))?/);
		return (hex_md5(pass+''+strAlg)).substr(sb[1],sb[2]);
	}
	return hex_md5(pass+''+strAlg);
}


/**
 *
 * algDomain
 *
 * Разбивает домен на домен и зону.
 * Если на входе FALSE, то возвращает массив с пустыми значениями.
 *
 * url - URL or false
 *
 * return [domain, domain zone] or ["","",""]
 * TODO извабиться от лишнего пустого аргумента
 * 
 */
function algDomain(url) {
	// Если нет домена
	if (!url) {return ["","",""];}

	var tURL = new URL(url).hostname.replace('www.',''),
		partURL;

	// Удаление поддоменов, если включено в настройках
	if (search_domain() && DATA[DOMAIN] && DATA[DOMAIN].subdomain) {
		tURL = tURL.substring(tURL.lastIndexOf(".", tURL.lastIndexOf(".") - 1) + 1);
	}
	return tURL.match(/(.*)\.(.*$)/);
}


/**
 *
 * Algorithm
 * 
 * a - generate algorithm
 * pass - Master Password
 * salt - Salt
 * url - URL
 *
 * Basic:
 *
 * 0 - Доменное имя целиком					alias: a, k, u, а, й, у, э
 * 1 - Доменная зона целиком				alias: b, l, v, б, к, ф, ю
 * 2 - Первая половина домена				alias: c, m, w, в, л, х, я
 * 3 - Вторая половина домена				alias: d, n, x, г, м, ц, -
 * 4 - Количества символов в домене			alias: e, o, y, д, н, ч, -
 * 5 - Количества символов в зоне			alias: f, p, z, е, о, ш, -
 * 6 - Соль целиком							alias: g, q, -, ё, п, щ, -
 * 7 - Мастер пароль целиком				alias: h, r, -, ж, р, ъ, -
 * 8 - Первая половина мастер пароля		alias: i, s, -, з, с, ы, -
 * 9 - Вторая половина мастер пароля		alias: j, t, -, и, т, ь, -
 *
 * Extended:
 *
 * 10 - Перевернутое доменое имя целиком
 * 11 - Перевернутая доменая зона целиком
 * 12 - Перевернутая первая половина домена
 * 13 - Перевернутая вторая половина домена
 * 14 - нет
 * 15 - нет
 * 16 - Перевернутая соль целиком
 * 17 - Перевернутый мастер пароль целиком
 * 18 - Перевернутая первая половина мастер пароля
 * 19 - Перевернутая вторая половина мастер пароля
 *
 * 160 - Первая половина соли
 * 161 - Вторая половина соли
 * 162 - Перевернутая первая половина соли
 * 163 - Перевернутая вторая половина соли
 *
*/
function alg(a,pass,salt,url) {
//	var
//		_url 		= new URL(url).hostname.replace('www.',''),
//		parsrUrl	= _url.match(/(.*)\.(.*$)/),
//
//		_0		= parsrUrl[1],				// Доменное имя целиком
//		_1		= parsrUrl[2],				// Доменная зона целиком
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

// Говнокод mode ON :D

	// Basic

	if (['0', 'a', 'k', 'u', 'а', 'й', 'у', 'э'].indexOf(a) >= 0){
		return algDomain(url)[1];
	};
	if (['1', 'b', 'l', 'v', 'б', 'к', 'ф', 'ю'].indexOf(a) >= 0){
		return algDomain(url)[2];
	};
	if (['2', 'c', 'm', 'w', 'в', 'л', 'х', 'я'].indexOf(a) >= 0){
		return halfString(algDomain(url)[1])[0]
	};
	if (['3', 'd', 'n', 'x', 'г', 'м', 'ц'].indexOf(a) >= 0){
		return halfString(algDomain(url)[1])[1]
	};
	if (['4', 'e', 'o', 'y', 'д', 'н', 'ч'].indexOf(a) >= 0){
		if (algDomain(url)[1].length > 0) {
			return algDomain(url)[1].length;
		} else {
			return "";
		}
	};
	if (['5', 'f', 'p', 'z', 'е', 'о', 'ш'].indexOf(a) >= 0){
		if (algDomain(url)[2].length > 0) {
			return algDomain(url)[2].length;
		} else {
			return "";
		}
	};
	if (['6', 'g', 'q', 'ё', 'п', 'щ'].indexOf(a) >= 0){
		return salt;
	};
	if (['7', 'h', 'r', 'ж', 'р', 'ъ'].indexOf(a) >= 0){
		return pass;
	};
	if (['8', 'i', 's', 'з', 'с', 'ы'].indexOf(a) >= 0){
		return halfString(pass)[0];
	};
	if (['9', 'j', 't', 'и', 'т', 'ь'].indexOf(a) >= 0){
		return halfString(pass)[1];
	};

	// Extended
	if (a == 10) {
		return reverseString(algDomain(url)[1]);
	}
	if (a == 11) {
		return reverseString(algDomain(url)[2]);
	}
	if (a == 12) {
		return reverseString(halfString(algDomain(url)[1])[0])
	}
	if (a == 13) {
		return reverseString(halfString(algDomain(url)[1])[1])
	}
	if (a == 14) {}
	if (a == 15) {}
	if (a == 16) {
		return reverseString(salt);
	}
	if (a == 17) {
		return reverseString(pass);
	}
	if (a == 18) {
		return reverseString(halfString(pass)[0]);
	}
	if (a == 19) {
		return reverseString(halfString(pass)[1]);
	}

	if (a == 160) {
		return halfString(salt)[0];
	}
	if (a == 161) {
		return halfString(salt)[1];
	}
	if (a == 162) {
		return reverseString(halfString(salt)[0]);
	}
	if (a == 163) {
		return reverseString(halfString(salt)[1]);
	}

// Говнокод mode OFF :D

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


/**
 * Reverse String
 *
 * Переворачивает строху (str) задом наперед.
 *
 * Return string
 */
function reverseString(str) {
	return str.split("").reverse().join("");
}


/**
 * Search settings for the current domain
 *
 * Поиск настроек для домена в базе
 *
 * Return settings or false
 */
function search_domain() {
	if (!DATA || !DOMAIN) {return false}
	return DATA[DOMAIN] || false;
}

/**
 * An error in the plugin settings
 *
 * Ошибка в настройках плагина
 *
 * Return false
 */
// TODO Переделать и расширить ошибки
function error_cfg() {
// @if NODE_ENV='chrome' || NODE_ENV='firefox'
	if (!document.querySelector('#errorCFG')) {
		var error = document.createElement('div');
		error.className = 'error';
		error.id = 'errorCFG';
		error.innerHTML = "Ошибка в настройках плагина!<br>Вероятно не введены данные!";
		document.getElementById('pswd').appendChild(error);
	}
	return false;
// @endif
// @if NODE_ENV='online'
	return "";
// @endif
}