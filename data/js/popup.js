var DATA, DOMAIN, CURBASE,
	password	= document.getElementById('password'),
	passinsert	= document.getElementById('passinsert');

function init(){
	var rules = ['subdomain','trim','login'];

	rules.forEach(function(el, i) {
		var rules_input = document.getElementById(el);

		rules_input.onchange = function(){
			var obj = {};
			if (CURBASE == false) {
				DATA[DOMAIN] = {};
			}
			obj = DATA[DOMAIN];
			if (this.type == "checkbox") {
				obj[el] = this.checked;
			} else {
				obj[el] = this.value;
			}
			saveSetting(DOMAIN,obj);
		};
		if (DATA && DATA[DOMAIN] && DATA[DOMAIN][el]) {
			if (typeof DATA[DOMAIN][el] === "boolean") {
				rules_input.checked = DATA[DOMAIN][el];
			} else {
				rules_input.value = DATA[DOMAIN][el];
			}
		}
	});

	setTimeout(function(){ // Firefox Hack !!!TODO - проверить show!!!
		password.focus();
	},100)
}

//// TODO Сделать show/hide

if (typeof chrome !== "undefined"){

	// Код для хрома
	chrome.storage.local.get(function (result) {
		DATA = result;
		
		if (!DATA['algorithm'] || !DATA['salt']) {
			alert("Настройте ¡No PASSarán!");
			try {
				chrome.tabs.create({ 'url': 'chrome-extension://'+chrome.runtime.id+'/data/setting.html'});
			} catch(e) {
				alert(e);
			}
		}

		chrome.tabs.query({currentWindow: true, active: true}, function(tab){

			DOMAIN = new URL(tab[0].url).hostname;
			DOMAIN = DOMAIN.substring(DOMAIN.lastIndexOf(".", DOMAIN.lastIndexOf(".") - 1) + 1);
			CURBASE	= search_domain(DATA,DOMAIN);

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
			password.addEventListener("keypress", function(e) {
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
				}
			}, false);
		});
	})
} else {

	// Код для фокса
	passinsert.addEventListener('click', function click(event) {
		self.port.emit(
			"text-entered",
			genPass(
				self.options.algorithm
				, password.value
				, self.options.salt
				, self.options.url
//				, self.options.base
			)
		);
	}, false);
	password.addEventListener("keypress", function(e) {
        if (e.keyCode === 13) {
            self.port.emit(
				"text-entered",
				genPass(
					self.options.algorithm
					, password.value
					, self.options.salt
					, self.options.url
//					, self.options.base
				)
			);
        }
    }, false);

	self.port.on("show", function onShow() {
		passinsert.focus(); // !!!TODO - проверить show!!!
	});
}


/**
 *
 * Gen Pasword from Algorithm
 *
 */
function genPass(a,pass,salt,url){
	var strAlg = ''
		, l;
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
 * Algorithm
 * 
 * a - generate algorithm
 * pass - Master Password
 * salt - Salt
 * url - URL
 *
 * Basic:
 *
 * 0 - Доменое имя целиком					alias: a, k, u, а, й, у, э
 * 1 - Доменая зона целиком					alias: b, l, v, б, к, ф, ю
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

	var tURL = new URL(url).hostname.replace('www.',''),
		partURL;

	// Удаление поддоменов, если включено в настройках
	if (CURBASE && DATA[DOMAIN] && DATA[DOMAIN].subdomain) {
		tURL = tURL.substring(tURL.lastIndexOf(".", tURL.lastIndexOf(".") - 1) + 1);
	}
	partURL = tURL.match(/(.*)\.(.*$)/);

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

// Говнокод mode ON :D

	// Basic

	if (['0', 'a', 'k', 'u', 'а', 'й', 'у', 'э'].indexOf(a) >= 0){
		return partURL[1];
	};
	if (['1', 'b', 'l', 'v', 'б', 'к', 'ф', 'ю'].indexOf(a) >= 0){
		return partURL[2];
	};
	if (['2', 'c', 'm', 'w', 'в', 'л', 'х', 'я'].indexOf(a) >= 0){
		return halfString(partURL[1])[0]
	};
	if (['3', 'd', 'n', 'x', 'г', 'м', 'ц'].indexOf(a) >= 0){
		return halfString(partURL[1])[1]
	};
	if (['4', 'e', 'o', 'y', 'д', 'н', 'ч'].indexOf(a) >= 0){
		return partURL[1].length;
	};
	if (['5', 'f', 'p', 'z', 'е', 'о', 'ш'].indexOf(a) >= 0){
		return partURL[2].length;
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
		return reverseString(partURL[1]);
	}
	if (a == 11) {
		return reverseString(partURL[2]);
	}
	if (a == 12) {
		return reverseString(halfString(partURL[1])[0])
	}
	if (a == 13) {
		return reverseString(halfString(partURL[1])[1])
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
function search_domain(base,domain) {
	if (!base) {return false}
	return base[domain] || false;
}