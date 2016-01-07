var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cssnano      = require('gulp-cssnano');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var notify       = require('gulp-notify');
var cache        = require('gulp-cache');
var newer        = require('gulp-newer');
var scp          = require('gulp-scp2');
var runSequence  = require('run-sequence');
var sass         = require('gulp-ruby-sass');
var babel        = require('gulp-babel');
var del          = require('del');
var vinylPaths   = require('vinyl-paths');

gulp.task('sass', function() {  
    return gulp.src('src/*.scss')
        .pipe(watch('src/*.scss'))
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer())
        // .pipe(gulp.dest('dist/assets/css'))
        // .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('build/'));
        // .pipe(notify({ message: 'Sass task complete' }))
});

gulp.task('hint', function() {  
    var stream = gulp.src('./src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
    return stream;
});

gulp.task('img', function() {  
  return gulp.src('./src/img/**/*')
    .pipe(watch('./src/img/**/*'))
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./build/'));
});

//===========================================================

gulp.task('clean', function() {  
  return gulp.src(['build/'])
    .pipe(vinylPaths(del));
});

gulp.task('dist-clean', function() {  
  return gulp.src(['dist/'])
    .pipe(vinylPaths(del));
});

gulp.task('css', function() {  
    return gulp.src('src/**/*.css')
        .pipe(newer('build/'))
        .pipe(autoprefixer())
        .pipe(gulp.dest('build/'));
});

gulp.task('dist-css', function() {  
    return gulp.src('src/**/*.css')
        .pipe(newer('dist/'))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('js', function() {  
    var stream = gulp.src('src/**/*.js')
    .pipe(newer('build/'))
    // .pipe(jshint())
    // .pipe(jshint.reporter('default'))
    // .pipe(concat('main.js'))
    // .pipe(gulp.dest('dist/assets/js'))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    // .pipe(babel({
    //     presets: ['es2015']
    // }))
    .pipe(gulp.dest('build/'));
    return stream;
});

gulp.task('dist-js', function() {  
    var stream = gulp.src('src/**/*.js')
    .pipe(newer('dist/'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
    return stream;
});

gulp.task('html', function() {
    return gulp.src('src/**/*.html')
        .pipe(newer('build/'))
        .pipe(gulp.dest('build/'));
});

gulp.task('dist-html', function() {
    return gulp.src('src/**/*.html')
        .pipe(newer('dist/'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('scp', function() {
	return gulp.src('build/dataeye/**')
    .pipe(scp({
        host: '',
        username: '',
        password: '',
        dest: ''
    }))
	.on('error', function(err) {
		console.log(err);
	});
});

gulp.task('dist-scp', function() {
    return gulp.src('dist/dataeye/**')
    .pipe(scp({
        host: '',
        username: '',
        password: '',
        dest: ''
    }))
    .on('error', function(err) {
        console.log(err);
    });
});

gulp.task('debug', function() {  
    runSequence(['html', 'css', 'js'], 'scp');
});

gulp.task('default', function() {  
	runSequence('dist-clean', ['dist-html', 'dist-css', 'dist-js'], 'dist-scp');
});