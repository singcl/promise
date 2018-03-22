/** es5版的gulp配置
 * 更多配置信息：https://github.com/gulpjs/gulp
 */
var gulp = require('gulp')
var uglify = require('gulp-uglify')

var paths = {
    scripts: {
        src: 'src/index.js',
        dest: 'dist/'
    }
}

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
}

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task('build', scripts)

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', ['build'], function() {
    //
})