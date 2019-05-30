"use strict";

var gulp         = require("gulp");
var del          = require("del");
var server       = require("browser-sync").create();
var autoprefixer = require("autoprefixer");
var svgstore     = require("gulp-svgstore");
var postcss      = require("gulp-postcss");
var plumber      = require("gulp-plumber");
var notify       = require("gulp-notify");
var imagemin     = require("gulp-image");
var uglify       = require("gulp-uglify");
var webp         = require("gulp-webp");
var sass         = require("gulp-sass");
var rename       = require("gulp-rename");
var sourcemap    = require("gulp-sourcemaps");

// Пути
var paths = {
  root: "./build",
  styles: {
    src: 'source/sass/**/*.scss',
    dest: 'build/css/'
  },
  scripts: {
    src: "source/js/**/*.js",
    dest: "build/js/"
  },
  html: {
    src: "source/*.html",
    dest: "build/"
  },
  images: {
    src: "source/img/**/*.{jpg,svg,png}",
    dest: "build/img/"
  },
  fonts: {
    src: "source/fonts/**/*.{woff,woff2}",
    dest: "build/fonts/"
  }
};

// Html
gulp.task("html", function () {
  return gulp.src(paths.html.src)
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {
          title: "Html",
          message: err.message
        };
      })
    }))
    .pipe(gulp.dest(paths.root))
    .pipe(server.stream());
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
});

//Оптимизация картинок
gulp.task('images', function () {
  return gulp.src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
});

// Формирование изображений в формате webp
gulp.task('webpImage', function () {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest(paths.images.dest));
});

// Минификация js
gulp.task("uglify", function() {
  return gulp.src(paths.scripts.src)
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {title: "Script", message: err.message};
      })
    }))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(server.stream());
});

// Очистка папки build
gulp.task("clean", function () {
  return del(paths.root);
});

// Запуск сервера
gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
  gulp.watch(paths.images.src, gulp.series('images'));
  gulp.watch(paths.scripts.src, gulp.series('uglify'));
});

// Создание SVG спрайта
gulp.task("sprite", function () {
  return gulp.src("source/img/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(paths.images.dest));
});

// Копирование файлов
gulp.task("copy", function  () {
  return gulp.src([
    paths.fonts.src,
    paths.images.src,
  ], {
    base: "source"
  })
  .pipe(gulp.dest(paths.root));
});

// Сборка проекта
gulp.task("build", gulp.series(
  "clean",
  "uglify",
  "copy",
  "images",
  "webpImage",
  "css",
  "sprite",
  "html"
));

gulp.task("start", gulp.series("build", "server"));
