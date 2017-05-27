'use strict';
//I declare all modules
  var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
  cleanCSS = require('gulp-clean-css'),
      maps = require('gulp-sourcemaps'),
       del = require('del'),
      buid = require('gulp-build'),
      pump = require('pump'),
  imagemin = require('gulp-imagemin'),
   connect = require('gulp-connect');
//COMPILE AND MINIFY JAVASCRIPTS
gulp.task("concatScripts", () => { //
return  gulp.src([
        'src/js/**/*.js' //declare dir all folders in js and all .js
    ])
    .pipe(maps.init()) //init maps
    .pipe(concat("all.js")) //here i concatenate with gulp-concat
    .pipe(maps.write('./'))//wrte globals.maps
    .pipe(gulp.dest("src/js/"));//dir output
});

gulp.task("minifyScripts", ["concatScripts"],() => { //I minify js files when concat is ready
    pump([
    gulp.src('src/js/all.js'), //dir
        uglify(),//minify
        rename('all.min.js'),//rename file
        gulp.dest('dist/scripts/')//output
      ]);

});
//COMPILE AND MINIFY SASS
gulp.task('compileSass', () => {
return   gulp.src('src/sass/global.scss') //dir
        .pipe(maps.init()) //init map
        .pipe(sass()) //compile to sass
        .pipe(maps.write('./'))//write maps in origin
        .pipe(gulp.dest('src/css/'));//output
});

gulp.task('minify-css',['compileSass'],() => {//I minify & concat css files when compileSass is ready
return  gulp.src('src/css/*.css')//dir
        .pipe(concat('style.min.css'))//concat
        .pipe(cleanCSS())//minify
        .pipe(gulp.dest('dist/styles/'))//output
        .pipe(connect.reload());//actualize changes in the server
});

//IMAGES
gulp.task('images', () => { //i compress png and jpeg
return  gulp.src('src/images/*')
        .pipe(imagemin([
          imagemin.jpegtran({progressive: true}),
          imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest('dist/content'))

});
//CLEAN
gulp.task('clean', function(){ //if run task clean dist is delete
  del(['dist']);
});
//SERVER
gulp.task('connect', function() { //local host
  connect.server({
    root: 'src',
    livereload: true
  });
});
//WATCH
gulp.task('watch',['build'], function(){//watch run when build is ready
  gulp.watch('src/sass/**/*.scss',['styles']);//watch sass directory for any change
})
//BUILD
gulp.task ('build',["clean"],function(){ //build wait for clean;
  gulp.start(["minifyScripts","minify-css","images"]);//later i run the array of tasks
});
//DEFAULT
gulp.task("default",["build"], function(){ //defaull run the task build and later the server with watch
  gulp.start(['connect','watch']);
});
//STYLES
gulp.task("scripts",["minifyScripts"]); //scripts run the compile and minify js
gulp.task("styles",["compileSass","minify-css"]); //and styles run compile and mininify
