//Adiciona os modulos instalados
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify-es").default;

//Função para compilas o SASS e adocionar os prefixos
function sassCompiler() {
  return gulp
    .src("css/scss/**/*.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest("css/"))
    .pipe(browserSync.stream());
}

//Tarefa para a função de SASS
exports.sassCompiler = sassCompiler;

//Função para juntar o JS
function gulpJS() {
  return gulp
    .src("js/main/*.js")
    .pipe(concat("main.js"))
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("js"))
    .pipe(browserSync.stream());
}

//Tarefa para a função de JS
exports.gulpJS = gulpJS;

//JS Plugins
function pluginJS() {
  return gulp
    .src(["node_modules/jquery/dist/jquery.min.js"])
    .pipe(concat("plugins.js"))
    .pipe(gulp.dest("js/"))
    .pipe(browserSync.stream());
}

//Tarefa de plugins JS
exports.pluginJS = pluginJS;

//Função para iniciar o browser
function browser() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}

//Tarefa para a função de browser-sync
exports.browser = browser;

//Função de watch do gulp
function watch() {
  gulp.watch("css/scss/**/*.scss", sassCompiler);
  gulp.watch("js/main/*.js", gulpJS);
  gulp.watch("js/plugins/*.js", pluginJS);
  gulp
    .watch([
      "*.html",
      "./**/*.html",
      "*.php",
      "./**/*.php",
      "*.jsx",
      "./**/*.jsx",
    ])
    .on("change", browserSync.reload);
}

//Inicia a função de watch
exports.watch = watch;

//Tarefa padrão do gulp
exports.default = gulp.parallel(watch, browser, sassCompiler, gulpJS, pluginJS);
