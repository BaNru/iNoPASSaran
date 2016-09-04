/*
 * Генерация списка с типами шифрования (хеширования)
 *
 * @param тип шифрования
 * @param hash тип шифрования
 * @param {boolean}, необязательный параметр, сохранение для Хрома
 * @param ID родителя, еобязательный параметр
 */
function GenHashList(hash, save, id){
	var select = document.getElementById(id) || document.getElementById('hashtype'),
		list = [{
				value: 'md5',
				title: 'MD5'
			},{
				value: 'ysp0',
				title: 'You Shall Pass'
			},{
				value: 'ysp1',
				title: 'You Shall Pass #'
			},{
				value: 'ysp2',
				title: 'You Shall Pass Original'
			},{
				value: 'ysp3',
				title: 'You Shall Pass Original #'
			}];

	list.forEach(function(el, i) {
		var option = document.createElement('option');
		option.value = el.value;
		option.text = el.title;
		select.appendChild(option);
	});

	select.value = hash || (function(){
// @if NODE_ENV='chrome'
	if(save){
		saveSetting('hashtype','md5');
	}
// @endif
		return 'md5';
	})();
// @if NODE_ENV='chrome'
	if(save){
		select.addEventListener("change", function(e) {
			saveSetting('hashtype',this.value);
		});
	}
// @endif
}