require("sdk/ui/button/action").ActionButton({
	id: "iNoPASSaran",
	label: "¡No PASSarán",
	icon: {
		"16": "./img/icon/16.png",
		"32": "./img/icon/32.png",
		"64": "./img/icon/64.png"
	},
	onClick: handleClick
});

function handleClick(state) {
	var preferences = require("sdk/simple-prefs").prefs,
		tabs = require('sdk/tabs'),
		popup = require("sdk/panel").Panel({
			contentURL: "./popup.html",
			contentScriptOptions: {
				lang		: preferences.lang,
				algorithm	: preferences.algorithm,
				salt		: preferences.salt,
				url			: tabs.activeTab.url
			},
			contentScriptFile: [
				"./js/lang.js",
				"./js/core.js",
				"./js/md5-min.js",
				"./js/popup.js"
			],
			width: 260,
			height: 60
		});
	popup.show();

	popup.on("show", function() {
		popup.port.emit("show");
	});

	popup.port.on("text-entered", function (text) {
		require("sdk/tabs").activeTab.attach({
			contentScript: 'this.document.activeElement.value = "' + text + '";'
		});
		popup.hide();
	});
}