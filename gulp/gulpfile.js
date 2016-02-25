var gulp = require('gulp'),
	iconfont = require('gulp-iconfont'),
	runTimestamp = Math.round(Date.now()/1000);

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