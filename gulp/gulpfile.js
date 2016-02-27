var gulp = require('gulp'),
	preprocess = require('gulp-preprocess'),
	iconfont = require('gulp-iconfont'),
	runTimestamp = Math.round(Date.now()/1000);

/* создание шрифтов из */
gulp.task('font', function(){
	return gulp.src(['../data/img/svg/*.svg'])
		.pipe(iconfont({
			fontName: 'icon',
			prependUnicode: true,
			formats: ['svg', 'woff'],
			timestamp: runTimestamp,
		}))
		.on('glyphs', function(glyphs, options) {
			console.log(glyphs, options);
		})
		.pipe(gulp.dest('../data/font/'));
});


// Сборка Firefox
gulp.task('firefox', function() {
	gulp.src('../data/popup.html')
		.pipe(preprocess({context: { NODE_ENV: 'firefox', DEBUG: false}}))
		.pipe(gulp.dest('../firefox/data/'));
	gulp.src('../data/js/popup.js')
		.pipe(preprocess({context: { NODE_ENV: 'firefox', DEBUG: false}}))
		.pipe(gulp.dest('../firefox/data/js/'));

	gulp.src(['../main.js','../package.json']).pipe(gulp.dest('../firefox/'));
	gulp.src('../data/js/md5-min.js').pipe(gulp.dest('../firefox/data/js/'));
	gulp.src('../data/css/*').pipe(gulp.dest('../firefox/data/css/'));
	gulp.src('../data/img/*.*').pipe(gulp.dest('../firefox/data/img/'));
	gulp.src('../data/img/icon/*').pipe(gulp.dest('../firefox/data/img/icon/'));
	gulp.src('../data/font/icon.woff').pipe(gulp.dest('../firefox/data/font/'));
	gulp.src('../locale/**').pipe(gulp.dest('../firefox/locale/'));

	require('child_process').exec('cd ../firefox/ && jpm xpi');
});

// Сборка Chrome
gulp.task('chrome', function() {
	gulp.src('../data/js/*').pipe(gulp.dest('../chrome/data/js/'));

	gulp.src('../data/popup.html')
		.pipe(preprocess({context: { NODE_ENV: 'chrome', DEBUG: true}}))
		.pipe(gulp.dest('../chrome/data/'));
	gulp.src('../data/js/popup.js')
		.pipe(preprocess({context: { NODE_ENV: 'chrome', DEBUG: false}}))
		.pipe(gulp.dest('../chrome/data/js/'));

	gulp.src(['../manifest.json','../background.js']).pipe(gulp.dest('../chrome/'));
	gulp.src('../data/setting.html').pipe(gulp.dest('../chrome/data/'));
	gulp.src('../data/css/*').pipe(gulp.dest('../chrome/data/css/'));
	gulp.src('../data/img/*.*').pipe(gulp.dest('../chrome/data/img/'));
	gulp.src('../data/img/icon/*').pipe(gulp.dest('../chrome/data/img/icon/'));
	gulp.src('../data/font/icon.woff').pipe(gulp.dest('../chrome/data/font/'));
	gulp.src('../_locales/**').pipe(gulp.dest('../chrome/_locales/'));

	// Не пашет :(
	//require('child_process').exec('google-chrome --pack-extension="../chrome/" --pack-extension-key="../../iNoPASSaran.pem"');
});