const gulp = require('gulp')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')

gulp.src('src/*.js')
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(uglify())
  .pipe(gulp.dest('output'))