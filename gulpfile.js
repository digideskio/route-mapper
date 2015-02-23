'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', function () {
 return gulp.src('src/**/*.js')
   .pipe(babel({
     optional: ['runtime'],
     experimental: true,
     playground: true,
     blacklist: ['regenerator', 'es6.templateLiterals']
   }))
  .pipe(gulp.dest('lib'));
});