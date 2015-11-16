var gulp         = require('gulp'),  
    sass         = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    rename       = require('gulp-rename'),
    clean        = require('gulp-clean'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache'),
    livereload   = require('gulp-livereload'),
    watch        = require('gulp-watch'),
    newer        = require('gulp-newer'),
    scp 		 = require('gulp-scp2'),
    runSequence  = require('run-sequence');

gulp.task('test', function() {  
    console.log('done');
});

gulp.task('sass', function() {  
    return gulp.src('src/*.scss')
        .pipe(watch('src/*.scss'))
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer())
        // .pipe(gulp.dest('dist/assets/css'))
        // .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./build/'));
        // .pipe(notify({ message: 'Sass task complete' }))
});

gulp.task('hint', function() {  
    var stream = gulp.src('./src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    return stream
});

gulp.task('img', function() {  
  return gulp.src('./src/img/**/*')
    .pipe(watch('./src/img/**/*'))
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./build/'));
});

//===========================================================

gulp.task('clean', function() {  
  return gulp.src(['./build/'], {read: false})
    .pipe(clean());
});

gulp.task('dist-clean', function() {  
  return gulp.src(['./dist/'], {read: false})
    .pipe(clean());
});

gulp.task('css', function() {  
    return gulp.src('./src/**/*.css')
        .pipe(newer('./build/'))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./build/'));
});

gulp.task('dist-css', function() {  
    return gulp.src('./src/**/*.css')
        .pipe(newer('./dist/'))
        .pipe(autoprefixer())
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('js', function() {  
    var stream = gulp.src('./src/**/*.js', {base: './src'})
    .pipe(newer('./build/'))
    // .pipe(jshint())
    // .pipe(jshint.reporter('default'))
    // .pipe(concat('main.js'))
    // .pipe(gulp.dest('dist/assets/js'))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    .pipe(gulp.dest('./build/'));
    return stream
});

gulp.task('dist-js', function() {  
    var stream = gulp.src('./src/**/*.js')
    .pipe(newer('./dist/'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
    return stream
});

gulp.task('html', function() {
    return gulp.src('./src/**/*.html')
        .pipe(newer('./build/'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('dist-html', function() {
    return gulp.src('./src/**/*.html')
        .pipe(newer('./dist/'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('scp', function() {
	return gulp.src('./build/dataeye/**')
	.pipe(scp({
		host: '',
		username: '',
		password: '',
		dest: '/home/'
	}))
	.on('error', function(err) {
		console.log(err);
	});
});

gulp.task('debug', function() {  
    runSequence(['html', 'css', 'js'], 'scp');
});

gulp.task('default', function() {  
	runSequence('dist-clean', ['dist-html', 'dist-css', 'dist-js']);
});