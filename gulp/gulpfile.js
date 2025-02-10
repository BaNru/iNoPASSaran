var gulp = require('gulp'),
	preprocess = require('gulp-preprocess'),
	iconfont = require('gulp-iconfont'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	watch = require('gulp-watch'),
	strip = require('gulp-strip-comments'),
	runTimestamp = Math.round(Date.now()/1000);

gulp.task('default', () => {
	gulp.watch(
		['../data/**/*'],
		{ usePolling: true },
		gulp.series(['chrome', 'online'])
	);
});

/* создание шрифтов из svg */
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

// Сборка Chrome
gulp.task('chrome', function() {
	gulp.src('../data/js/!(popup)*.js').pipe(gulp.dest('../chrome/data/js/'));

	gulp.src('../data/popup.html')
		.pipe(preprocess({context: { NODE_ENV: 'chrome', DEBUG: false}}))
		.pipe(gulp.dest('../chrome/data/'));
	gulp.src('../data/js/popup.js')
		.pipe(preprocess({context: { NODE_ENV: 'chrome', DEBUG: false}}))
		.pipe(strip())
		.pipe(gulp.dest('../chrome/data/js/'));
	gulp.src('../data/css/*')
		.pipe(preprocess({ context: { NODE_ENV: 'chrome', DEBUG: false } }))
		.pipe(gulp.dest('../chrome/data/css/'));

	gulp.src('../manifest.json').pipe(gulp.dest('../chrome/'));
	gulp.src('../data/setting.html').pipe(gulp.dest('../chrome/data/'));
	gulp.src('../data/img/*.*', { encoding: false }).pipe(gulp.dest('../chrome/data/img/'));
	gulp.src('../data/img/icon/*').pipe(gulp.dest('../chrome/data/img/icon/'));
	gulp.src('../data/font/icon.woff').pipe(gulp.dest('../chrome/data/font/'));
	return gulp.src('../_locales/**').pipe(gulp.dest('../chrome/_locales/'));
});

gulp.task('online', function() {
	gulp.src('../data/popup.html')
		.pipe(preprocess({context: { NODE_ENV: 'online', DEBUG: true}}))
		.pipe(rename({basename: "index"}))
		.pipe(gulp.dest('../online/'));
	gulp.src('../data/css/style.css')
		.pipe(preprocess({context: { NODE_ENV: 'online', DEBUG: true}}))
		.pipe(replace(/\.\.\//g, '../../data/'))
		.pipe(gulp.dest('../online/css/'));
	return gulp.src('../data/js/popup.js')
		.pipe(preprocess({context: { NODE_ENV: 'online', DEBUG: true}}))
		.pipe(gulp.dest('../online/js/'));
});